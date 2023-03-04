import IPData from 'ipdata';
import requestIp from 'request-ip';
import config from '@/config';
import { reject } from 'lodash';

const ipdata = new IPData(config.IPDATA_API_KEY);

export const ipToLocationInfo = (ip) =>
  new Promise((resolve, reject) => {
    ipdata
      .lookup(ip)
      .then((info) => resolve(info))
      .catch((error) => reject(error));
  });

export const ipMiddleware = (req, res, next) => {
  const clientIp = requestIp.getClientIp(req);
  req.clientIp = clientIp;
  next();
};

export const convertIpFromV6ToV4 = (ip6) => {
  function parseIp6(ip6str) {
    const str = ip6str.toString();

    // Initialize
    const ar = new Array();
    for (var i = 0; i < 8; i++) ar[i] = 0;

    // Check for trivial IPs
    if (str == '::') return ar;

    // Parse
    const sar = str.split(':');
    let slen = sar.length;
    if (slen > 8) slen = 8;
    let j = 0;
    i = 0;
    for (i = 0; i < slen; i++) {
      // This is a "::", switch to end-run mode
      if (i && sar[i] == '') {
        j = 9 - slen + i;
        continue;
      }
      ar[j] = parseInt(`0x0${sar[i]}`);
      j++;
    }

    return ar;
  }

  var ip6parsed = parseIp6(ip6);
  const ip4 = `${ip6parsed[6] >> 8}.${ip6parsed[6] & 0xff}.${ip6parsed[7] >> 8}.${
    ip6parsed[7] & 0xff
  }`;

  return ip4;
};
