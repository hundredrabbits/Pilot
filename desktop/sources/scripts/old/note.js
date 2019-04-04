exports.fromCase = function (n) {
  let upperCase = n.toUpperCase()
  if (n == upperCase) return n
  // it was lowercase. make sharp
  return `${upperCase}#`
}
