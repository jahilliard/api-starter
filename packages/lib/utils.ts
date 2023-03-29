import _ from 'lodash'

export function encodeURLQuery(query: { [s: string]: string | number | boolean }): string {
  if (!_.isObjectLike(query)) {
    throw new Error('Query Object Params not object ')
  }
  const bodyElements = Object.entries(query) as [string, string | number | boolean][]
  return bodyElements.reduce((accumFormValue, [key, value], indx) => {
    let formVal = `${accumFormValue}${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    if (indx !== bodyElements.length) {
      formVal = formVal.concat('&')
    }
    return formVal
  }, '')
}
