export type TLData = {
  mode: string
  phase: number
  bossName: string
  damage: number
  duration: number
  battleDate: string
  characters: { lv: number; name: string; star: number; rank: number }[]
  startTime: number
  endTime: number
  timeline: { time: number; name: string }[]
}

// 01:20⇒80のように分秒表記を秒に変更
const timeStr2Num = (timeStr: string) => {
  return parseInt(timeStr.substr(0, 2)) * 60 + parseInt(timeStr.substr(3, 2))
}

// 80⇒01:20のように秒を分秒表記に変更
const timeNum2Str = (timeNum: number) => {
  const min = Math.floor(timeNum / 60)
  const sec = timeNum % 60
  return ('00' + min).slice(-2) + ':' + ('00' + sec).slice(-2)
}

// プリコネのTL書き出し機能により出力された文字列から情報を抜き出す
export const parseTlData = (text: string): TLData => {
  function* readLine(text: string) {
    const lines: string[] = text.split(/\r\n|\n/).filter((line: string) => {
      return line !== ''
    })
    for (const line of lines) {
      yield line.split(' ')
    }
  }
  const it = readLine(text)
  const tlData: TLData = <TLData>{}
  // 1行目
  // クランモード 5段階目 シードレイク
  let line = it.next().value
  if (line) {
    tlData.mode = line[0]
    tlData.phase = parseInt(line[1].replace('段階目', ''))
    tlData.bossName = line[2]
  }
  // 2行目
  // 32702296ダメージ
  line = it.next().value
  if (line) {
    tlData.damage = parseInt(line[0].replace('ダメージ', ''))
  }
  // 3行目
  // バトル時間 01:30
  line = it.next().value
  if (line) {
    tlData.duration = timeStr2Num(line[1])
  }
  // 4行目
  // バトル日時 2021/06/29 22:40
  line = it.next().value
  if (line) {
    tlData.battleDate = line[1] + ' ' + line[2]
  }
  // 5行目
  // ----
  line = it.next().value
  // 6行目
  // ◆パーティ編成
  line = it.next().value
  // 7~11行目
  // アカリ ★6 Lv202 RANK14
  // サレン（サマー） ★3 Lv202 RANK14
  // ネネカ ★5 Lv202 RANK21
  // キャル（ニューイヤー） ★4 Lv202 RANK21
  // ルナ ★5 Lv202 RANK21
  tlData.characters = []
  for (let i = 0; i < 5; i++) {
    line = it.next().value
    if (line) {
      tlData.characters[i] = {
        lv: parseInt(line[2].replace('Lv', '')),
        name: line[0],
        star: parseInt(line[1].replace('★', '')),
        rank: parseInt(line[3].replace('RANK', '')),
      }
    }
  }
  // 12行目
  // ----
  line = it.next().value
  // 13行目
  // ◆ユニオンバースト発動時間
  line = it.next().value
  // 14行目
  // 01:30 バトル開始
  line = it.next().value
  if (line) {
    tlData.startTime = timeStr2Num(line[0])
  }
  // 15行目以降
  // 01:19 アカリ
  // ~
  // 00:00 バトル終了
  tlData.timeline = []
  while ((line = it.next().value)) {
    if (line[1] === 'バトル終了') {
      tlData.endTime = timeStr2Num(line[0])
    } else {
      tlData.timeline.push({
        name: line[1],
        time: timeStr2Num(line[0]),
      })
    }
  }
  return tlData
}

export const formatTL = (
  tl: string,
  headerFormat: string,
  selfUbFormat: string,
  bossUbFormat: string,
  footerFormat: string,
  nameConvs: { [key: string]: string },
  startTime: number,
  paddingName: string
): string => {
  const headerTemplateText = headerFormat + '\n'
  const characterUbTemplateText = selfUbFormat + '\n'
  const bossUbTemplateText = bossUbFormat + '\n'
  const footerTemplateText = footerFormat + '\n'
  const tlData = parseTlData(tl)

  // 名前の変換を行う
  const convertName = (name: string) => {
    if (name in nameConvs) {
      return nameConvs[name]
    }
    return name
  }

  // 半角は1文字 全角は2文字として文字数をカウント
  const getLen = (str: string) => {
    let result = 0
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i)
      if (
        (chr >= 0x00 && chr < 0x81) ||
        chr === 0xf8f0 ||
        (chr >= 0xff61 && chr < 0xffa0) ||
        (chr >= 0xf8f1 && chr < 0xf8f4)
      ) {
        //半角文字の場合は1を加算
        result += 1
      } else {
        //それ以外の文字の場合は2を加算
        result += 2
      }
    }
    //結果を返す
    return result
  }

  // 一番長い名前のキャラの名前の長さ
  const maxLength = Math.max(
    ...tlData.characters.map((character) => getLen(convertName(character.name)))
  )
  const doPadding = (name: string) => {
    const nameLen = getLen(name)
    const paddingStr =
      Array(Math.floor((maxLength - nameLen) / 2) + 1).join('　') +
      ((maxLength - nameLen) % 2 === 1 ? ' ' : '')
    switch (paddingName) {
      case 'none':
        return name
      case 'head':
        return paddingStr + name
      default:
        return name + paddingStr
    }
  }

  const lessTime = tlData.startTime - startTime
  let timelineOutput = ''
  for (const ub of tlData.timeline) {
    if (ub.time - lessTime < 1) {
      // 時間不足によりUBが打てなければ以降をカット
      break
    }

    if (ub.name === tlData.bossName) {
      timelineOutput += bossUbTemplateText.replace(
        '<UB使用時秒数>',
        timeNum2Str(ub.time - lessTime).substr(1)
      )
    } else {
      timelineOutput += characterUbTemplateText
        .replace('<UB使用時秒数>', timeNum2Str(ub.time - lessTime).substr(1))
        .replace('<UB使用キャラ名>', doPadding(convertName(ub.name)))
    }
  }
  timelineOutput = headerTemplateText + timelineOutput + footerTemplateText
  return timelineOutput
    .replace('<モード>', tlData.mode)
    .replace('<段階>', tlData.phase.toString())
    .replace('<ボス名>', tlData.bossName.toString())
    .replace('<詳細与ダメージ>', tlData.damage.toString())
    .replace('<ダメージ>', Math.floor(tlData.damage / 10000) + '万')
    .replace('<所要秒数>', tlData.duration.toString())
    .replace('<バトル日時>', tlData.battleDate.toString())
    .replace('<キャラ1名>', doPadding(convertName(tlData.characters[0].name)))
    .replace('<キャラ1星>', tlData.characters[0].star.toString())
    .replace('<キャラ1R>', tlData.characters[0].rank.toString())
    .replace('<キャラ1LV>', tlData.characters[0].lv.toString())
    .replace('<キャラ2名>', doPadding(convertName(tlData.characters[1].name)))
    .replace('<キャラ2星>', tlData.characters[1].star.toString())
    .replace('<キャラ2R>', tlData.characters[1].rank.toString())
    .replace('<キャラ2LV>', tlData.characters[1].lv.toString())
    .replace('<キャラ3名>', doPadding(convertName(tlData.characters[2].name)))
    .replace('<キャラ3星>', tlData.characters[2].star.toString())
    .replace('<キャラ3R>', tlData.characters[2].rank.toString())
    .replace('<キャラ3LV>', tlData.characters[2].lv.toString())
    .replace('<キャラ4名>', doPadding(convertName(tlData.characters[3].name)))
    .replace('<キャラ4星>', tlData.characters[3].star.toString())
    .replace('<キャラ4R>', tlData.characters[3].rank.toString())
    .replace('<キャラ4LV>', tlData.characters[3].lv.toString())
    .replace('<キャラ5名>', doPadding(convertName(tlData.characters[4].name)))
    .replace('<キャラ5星>', tlData.characters[4].star.toString())
    .replace('<キャラ5R>', tlData.characters[4].rank.toString())
    .replace('<キャラ5LV>', tlData.characters[4].lv.toString())
    .replace('<開始秒数>', timeNum2Str(tlData.startTime - lessTime).substr(1))
    .replace(
      '<終了秒数>',
      timeNum2Str(
        tlData.endTime - lessTime > 0 ? tlData.endTime - lessTime : 0
      ).substr(1)
    )
}
