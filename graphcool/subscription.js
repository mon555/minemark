module.exports = function (event) {
  const MAILGUN_API_KEY = 'MAILGUN_API_KEY'
  const MAILGUN_DOMAIN = 'rabbot.io'
  const userId = event.data.User.node.id
  const VERIFY_URL = `http://localhost:3000/?action=verify&id=${userId}`
  const email = event.data.User.node.email

  const mailgun = require('mailgun-js')({
    apiKey: MAILGUN_API_KEY,
    domain: MAILGUN_DOMAIN
  })

  const data = {
    to: email,
    from: `noreply@${MAILGUN_DOMAIN}`,
    subject: '[MineMark] Please confirm your subscriptions',
    html: `<html>
    <div style="text-align: center;">
      <p style="margin: 2px;">Hi, there! Please click to confirm. :)</p>
      <p style="margin: 2px;padding-right: 16px;"> \ </p>
      <img width="32px" height="32px" src="https://raw.githubusercontent.com/rabbotio/minemark/master/public/kat.png">
      <br/>
      <div style="display: inline-block;"><a href="${VERIFY_URL}" style='cursor: pointer;position:relative;width: 64px;line-height: 24px;display: block;color:#ecf0f1;text-decoration:none;border-radius:5px;border:solid 1px #bdc3c7;background:#95a5a6;text-align:center;margin: 8px;outline: none;-webkit-box-shadow: 0px 3px 0px #7f8c8d;-moz-box-shadow: 0px 3px 0px #7f8c8d;box-shadow: 0px 3px 0px #7f8c8d;'>CONFIRM</a></div>
      <br/>
      <p style="font-size: xx-small;color:#cccccc;">COPYRIGHT 2017 ❤ <a href="https://rabbot.io" style="font-size: xx-small;color:#cccccc;text-decoration-line: none;">RABBOT.IO</a></p>
    </div>
    </html>`
  }

  return new Promise(function (resolve, reject) {
    mailgun.messages().send(data, function (err, body) {
      if (err) {
        console.error(err)
        return reject(err)
      }

      console.info('Sent:', body)
      resolve({ data: event.data.User.node })
    })
  })
}