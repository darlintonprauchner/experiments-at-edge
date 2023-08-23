export const getCookie = (headers, oneCookie) => {
  if (headers.cookie) {
      for (const cookieHeader of headers.cookie) {
          const cookies = cookieHeader.value.split(';');
          for (const cookie of cookies) {
              const [key, val] = cookie.split('=');
              if (key === oneCookie) {
                  return val;
              }
          }
      }
  }
  return null;
}

export const setCookie = (response, oneCookie) => {
  console.log(`Setting cookie ${oneCookie}`);
  response.headers['set-cookie'] = response.headers['set-cookie'] || [];
  response.headers['set-cookie'] = [{
      key: 'Set-Cookie',
      value: oneCookie
  }];
}

