export const configServiceMock = {
  get: jest.fn((key: string) => {
    return process.env[key];
  }),
};
