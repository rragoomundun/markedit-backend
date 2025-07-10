import fs from 'fs';
import nodemailer from 'nodemailer';
import mustache from 'mustache';
import { SendEmailCommand } from '@aws-sdk/client-sesv2';

import User from '../models/User.js';

import { ses } from './aws.util.js';

const transporter = nodemailer.createTransport({
  SES: { sesClient: ses, SendEmailCommand },
  sendingRate: 1
});

const send = async (options) => {
  const { mail, userId } = options;

  const user = await User.findOne({ where: { id: userId } });
  const { name } = user;
  const to = user.email;

  const mailData = JSON.parse(fs.readFileSync(`mails/definitions/${mail}.json`));
  const templateName = mailData.template;
  let templateOptions = options.templateOptions;

  if (!templateOptions) {
    templateOptions = {};
  }

  templateOptions.name = name;
  templateOptions.title = mailData.title;
  templateOptions.year = new Date().getFullYear();
  templateOptions.bucket = process.env.AWS_S3_BUCKET_NAME;
  templateOptions.s3region = process.env.AWS_S3_REGION;

  const template =
    fs.readFileSync(`mails/views/header.html`, 'utf-8') +
    fs.readFileSync(`mails/views/${templateName}.html`, 'utf-8') +
    fs.readFileSync(`mails/views/footer.html`, 'utf-8');

  const message = {
    to,
    replyTo: process.env.REPLY_EMAIL,
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    html: mustache.render(template, templateOptions),
    subject: templateOptions.title
  };

  await transporter.sendMail(message);
};

export default { send };
