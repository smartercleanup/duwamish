import Expression from "../expression.tsx";

const getNumericalValsByKey = (dataset, key) => {
  return dataset.reduce((validVals, place) => {
    const val = parseFloat(place[key]);

    return isNaN(val) ? validVals : [...validVals, val];
  }, []);
};

const getPlaceVal = (context: EvaluationContext) => {
  const val = context.place[context.key];

  return typeof val === "undefined" ? null : val;
};

const getDatasetSum = (context: EvaluationContext) => {
  return context.dataset.reduce((sum, place) => {
    const val = parseFloat(place[context.key]);

    return isNaN(val) ? sum : sum + val;
  }, 0);
};

const getDatasetMean = (context: EvaluationContext) => {
  const sum = getDatasetSum(context);

  return sum / context.dataset.length;
};

const getDatasetMax = (context: EvaluationContext) => {
  const vals = getNumericalValsByKey(context.dataset, context.key);

  return Math.max(...vals);
};

const getDatasetMin = (context: EvaluationContext) => {
  const vals = getNumericalValsByKey(context.dataset, context.key);

  return Math.min(...vals);
};

const getDatasetCount = (context: EvaluationContext) => {
  return context.dataset.filter(place => place[context.key]).length;
};

const makeLookup = (op, lookupFn) => {
  return class Lookup implements Expression {
    static parse(args, parsingContext) {
      const op = args[0];
      if (args.length !== 2) {
        // eslint-disable-next-line no-console
        console.error(`Error: expected one argument for "${op}"`);
        return;
      }

      return new Lookup();
    }

    evaluate(evaluationContext: EvaluationContext) {
      return lookupFn(evaluationContext);
    }
  };
};

export const GetPlaceVal = makeLookup("get-val", getPlaceVal);
export const GetDatasetSum = makeLookup("get-sum", getDatasetSum);
export const GetDatasetMean = makeLookup("get-mean", getDatasetMean);
export const GetDatasetMax = makeLookup("get-max", getDatasetMax);
export const GetDatasetMin = makeLookup("get-min", getDatasetMin);
export const GetDatasetCount = makeLookup("get-count", getDatasetCount);