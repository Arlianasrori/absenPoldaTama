import randomString from "randomstring";

export const generateId = () => {
    return parseInt(randomString.generate({
        charset: 'numeric',
        length: 6
      }));
};