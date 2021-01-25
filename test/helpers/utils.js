export const cloneClassInstance = classInstance =>
  Object.assign(Object.create(Object.getPrototypeOf(classInstance)), classInstance);

export const cloneAndUpdate = (classInstance, key, value) => {
  const instance = cloneClassInstance(classInstance);
  instance[key] = value;

  return instance;
};
