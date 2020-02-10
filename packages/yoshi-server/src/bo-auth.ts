import { WixBootstrapBoAuth } from 'wix-bootstrap-bo-auth';
import { FunctionContext } from './types';

export const forbid = async ({
  req,
  res,
  context,
}: FunctionContext): Promise<void> => {
  const boAuth: WixBootstrapBoAuth.BoAuth = context.boAuth;

  return new Promise((resolve, reject) => {
    boAuth.forbid()(req, res, error => (error ? reject(error) : resolve()));
  });
};

export const redirect = async ({
  req,
  res,
  context,
}: FunctionContext): Promise<void> => {
  const boAuth: WixBootstrapBoAuth.BoAuth = context.boAuth;

  return new Promise((resolve, reject) => {
    boAuth.redirect()(req, res, error => (error ? reject(error) : resolve()));
  });
};
