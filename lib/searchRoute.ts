import { FavsInfo } from '../components/FavsTab'

/** 例えばオウカ、ユカリ、ネネカ、キャル、ルナという編成があったら
オウカ、ユカリ、ネネカ、キャルのようにサポートを除いた4キャラの組み合わせを5つ作る
これを全てのFavsに対して行う*/
export const calcExcludeSupportArray = (favs: {
  [key: string]: FavsInfo
}): { id: string; consumptionCharacters: string[] }[] => {
  const retArr = []
  Object.keys(favs).map((key) => {
    const fav = favs[key].characters

    for (let i = 0; i < fav.length; i++) {
      const excludeSupport = []
      for (let j = 0; j < fav.length; j++) {
        if (i !== j) {
          excludeSupport.push(fav[j].name)
        }
      }
      retArr.push({
        id: key,
        consumptionCharacters: excludeSupport,
      })
    }
  })
  return retArr
}

/** 1凸分の本凸とその持ち越しの組み合わせを抽出する */
export const calcCombinationOfAttackAndRest = (
  excludeSupportArray: { id: string; consumptionCharacters: string[] }[],
  favs: { [key: string]: FavsInfo }
): { idAttack: string; idRest: string; consumptionCharacters: string[] }[] => {
  const combinationOfAttackAndRest = []
  for (let i = 0; i < excludeSupportArray.length; i++) {
    const attack = excludeSupportArray[i]
    combinationOfAttackAndRest.push({
      idAttack: attack.id,
      idRest: '',
      consumptionCharacters: attack.consumptionCharacters,
    })
    if (favs[attack.id].duration < 90) {
      // 90秒未満なら持ち越しでもう1回殴ることができる
      for (let j = i; j < excludeSupportArray.length; j++) {
        const rest = excludeSupportArray[j]
        // 合計消費時間が90 + 20未満なら可能な組み合わせに入れる
        if (favs[attack.id].duration + favs[rest.id].duration < 90 + 20) {
          combinationOfAttackAndRest.push({
            idAttack: attack.id,
            idRest: rest.id,
            consumptionCharacters: Array.from(
              new Set(
                attack.consumptionCharacters.concat(rest.consumptionCharacters)
              )
            ),
          })
        }
      }
    }
  }
  return combinationOfAttackAndRest
}

/** 3凸ルートを検索する */
export const calcAttackRoute = (
  favs: { [key: string]: FavsInfo },
  bestOf = 100,
  mustIncludeBoss = ''
): string[][] => {
  const excludeSupportArray = calcExcludeSupportArray(favs)
  const combinationOfAttackAndRest = calcCombinationOfAttackAndRest(
    excludeSupportArray,
    favs
  )

  const routes: { [key: string]: string[] } = {}

  for (let i = 0; i < combinationOfAttackAndRest.length - 2; i++) {
    const attack1 = combinationOfAttackAndRest[i]
    for (let j = i + 1; j < combinationOfAttackAndRest.length - 1; j++) {
      const attack2 = combinationOfAttackAndRest[j]
      const attack12ConsumptionCharacters = Array.from(
        new Set(
          attack1.consumptionCharacters.concat(attack2.consumptionCharacters)
        )
      )
      // 1凸目と2凸目にキャラに重複が無い場合にのみ3凸目を探す
      if (
        attack12ConsumptionCharacters.length ===
        attack1.consumptionCharacters.length +
          attack2.consumptionCharacters.length
      ) {
        for (let k = j + 1; k < combinationOfAttackAndRest.length; k++) {
          const attack3 = combinationOfAttackAndRest[k]
          const attack123ConsumptionCharacters = Array.from(
            new Set(
              attack12ConsumptionCharacters.concat(
                attack3.consumptionCharacters
              )
            )
          )

          // 1凸目～3凸目にキャラに重複が無い場合にのみ凸ルートを追加
          if (
            attack123ConsumptionCharacters.length ===
            attack1.consumptionCharacters.length +
              attack2.consumptionCharacters.length +
              attack3.consumptionCharacters.length
          ) {
            if (
              // 凸ルートに必要なボスがいるならそれも条件にする
              mustIncludeBoss === '' ||
              mustIncludeBoss === favs[attack1.idAttack].bossName ||
              (attack1.idRest &&
                mustIncludeBoss === favs[attack1.idRest].bossName) ||
              mustIncludeBoss === favs[attack2.idAttack].bossName ||
              (attack2.idRest &&
                mustIncludeBoss === favs[attack2.idRest].bossName) ||
              mustIncludeBoss === favs[attack2.idAttack].bossName ||
              (attack3.idRest &&
                mustIncludeBoss === favs[attack3.idRest].bossName)
            ) {
              const routeIds = [
                attack1.idAttack,
                attack1.idRest,
                attack2.idAttack,
                attack2.idRest,
                attack3.idAttack,
                attack3.idRest,
              ]
              routes[routeIds.join()] = routeIds
            }
          }
        }
      }
    }
  }
  // 数が多いと表示に困るのでダメージが出る順に並び変える
  const best100Routes = Object.keys(routes)
    .sort((key1, key2) => {
      const route1 = routes[key1]
      const route2 = routes[key2]
      // route1の時のダメージ数値
      const damage1 = route1
        .map((favsId) => (favsId ? favs[favsId].damage : 0))
        .reduce((sum, damage) => {
          return sum + damage
        })
      // route2の時のダメージ数値
      const damage2 = route2
        .map((favsId) => (favsId ? favs[favsId].damage : 0))
        .reduce((sum, damage) => {
          return sum + damage
        })

      return damage2 - damage1
    })
    .map((routesId) => routes[routesId])
    .slice(0, bestOf)
  return best100Routes
}

const buildAttackLineText = (
  id: string,
  favs: { [key: string]: FavsInfo },
  prefix: string
) => {
  return id
    ? `- ${prefix} ${favs[id].bossName} ${Math.floor(
        favs[id].damage / 10000
      )}万 編成[ ${favs[id].characters
        .map((character) => character.name)
        .join()} ]  TLリンク[ ${process.env.siteUrl + id} ]\n`
    : ''
}

/** 3凸ルートをテキスト化して見やすくする */
export const buildOutputText = (
  attackRoute: string[][],
  favs: { [key: string]: FavsInfo }
): string => {
  let outputText = ''
  attackRoute.forEach((route) => {
    const attack1Id = route[0]
    const rest1Id = route[1]
    const attack2Id = route[2]
    const rest2Id = route[3]
    const attack3Id = route[4]
    const rest3Id = route[5]

    const attack1Damage = favs[attack1Id].damage
    const rest1Damage = rest1Id ? favs[rest1Id].damage : 0
    const attack2Damage = favs[attack2Id].damage
    const rest2Damage = rest2Id ? favs[rest2Id].damage : 0
    const attack3Damage = favs[attack3Id].damage
    const rest3Damage = rest3Id ? favs[rest3Id].damage : 0

    outputText += `合計ダメージ${Math.floor(
      (attack1Damage +
        rest1Damage +
        attack2Damage +
        rest2Damage +
        attack3Damage +
        rest3Damage) /
        10000
    )}万\n`

    outputText += buildAttackLineText(attack1Id, favs, '1凸目')
    outputText += buildAttackLineText(rest1Id, favs, '1凸目持ち越し')
    outputText += buildAttackLineText(attack2Id, favs, '2凸目')
    outputText += buildAttackLineText(rest2Id, favs, '2凸目持ち越し')
    outputText += buildAttackLineText(attack3Id, favs, '3凸目')
    outputText += buildAttackLineText(rest3Id, favs, '3凸目持ち越し')
    outputText += '\n'
  })
  return outputText
}

/** 3凸ルートをテキストファイルとして出力する */
export const outputRouteTextFile = (
  favs: { [key: string]: FavsInfo },
  bestOf = 100,
  mustIncludeBoss = ''
): void => {
  const outputText = buildOutputText(
    calcAttackRoute(favs, bestOf, mustIncludeBoss),
    favs
  )
  const blob = new Blob(outputText.split(''), { type: 'text/plan' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'routes.txt'
  link.click()
}
