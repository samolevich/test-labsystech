const seedSet = (from, to, len) => {
  const numbersList = [];
  for (let i = 0; i < len; i += 1) {
    numbersList.push(Math.trunc(Math.random() * (to - from) + from));
  }
  return numbersList.toString();
};

const notationSystem = () => {
  let chars = "";
  for (let i = 35; i < 126; i++) chars += String.fromCharCode(i);
  return [chars, chars.length];
};

const convertDec = (num) => {
  const [symbolsSet, radix] = notationSystem();
  let result = "";
  while (num >= radix) {
    result += symbolsSet[num % radix];
    num = Math.trunc(num / radix);
  }
  result += symbolsSet[num % radix];
  return result;
};

const serialize = (inputString) => {
  console.log("Исходная строка\n", inputString);

  if (!inputString.length) return inputString;

  const countNumbs = inputString.split(",").toSorted((a, b) => a - b).reduce((stats, num) => {
    num = Number(num);
    stats.has(num) ? stats.set(num, stats.get(num) + 1) : stats.set(num, 1);
    return stats;
  }, new Map());

  let from = Array.from(countNumbs.keys())[0];
  let to = from;
  const result = [];
  for (const num of countNumbs.keys()) {
    if (num - to <= 1) to = num;
    else {
      if (from === to) {
        result.push(convertDec(from));
        from = num;
        to = num;
      } else {
        result.push(`${convertDec(from)}"${convertDec(to)}`);
        from = num;
        to = num;
      }
    }
  }
  if (!result.length) {
    result.push(`${convertDec(from)}"${convertDec(to)}`);
  }
  for (const num of countNumbs.keys()) {
    if (countNumbs.get(num) > 1) {
      result.push(`${convertDec(num)}~${convertDec(countNumbs.get(num) - 1)}`)
    };
  }
  const outputString = result.join("!");
  console.log("Сжатая строка\n", outputString);
  console.log("Коэффициент сжатия", Math.trunc((outputString.length / inputString.length) * 100), "%");
  return outputString;
};

const deSerialize = (inputString) => {
  const decode = str => {
    let decNum = 0;
    const [chars, radix] = notationSystem();
    for (let i = 0; i < str.length; i++ ) {
      decNum += chars.indexOf(str[i]) * (radix ** i);
    }
    return decNum;
  }

  const splittedString = inputString.split('!').reduce((acc, cur) => {
    if (cur.includes('"')) {
      const arr = cur.split('"').map(decode);
      let num = arr[0]
      while (num <= arr[1]) acc.push(num++)
    } else if (cur.includes('~')) {
      const range = cur.split('~').map(decode);
      let num = range[0];
      let count = range[1];
      while (count > 0) {
        acc.push(num);
        count--;
      }
    } else {
      acc.push(decode(cur));
    }
    return acc;
  }, []);

  console.log('---\nДекодировано\n', splittedString.toString());
  return splittedString.toString();
};

deSerialize(serialize(seedSet(1, 301, 10)));
deSerialize(serialize(seedSet(92, 94, 10)));
deSerialize(serialize(seedSet(1, 301, 20)));
deSerialize(serialize(seedSet(1, 301, 50)));
deSerialize(serialize(seedSet(1, 301, 100)));
deSerialize(serialize(seedSet(1, 301, 500)));
deSerialize(serialize(seedSet(1, 301, 1000)));
deSerialize(serialize(seedSet(1, 11, 1000)));
deSerialize(serialize(seedSet(11, 100, 1000)));
deSerialize(serialize(seedSet(100, 301, 1000)));


