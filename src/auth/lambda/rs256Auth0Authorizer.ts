
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIC+zCCAeOgAwIBAgIJHAp37mFhNxDIMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNV
BAMTEGZmci5ldS5hdXRoMC5jb20wHhcNMjAwNzA5MTYyODQ1WhcNMzQwMzE4MTYy
ODQ1WjAbMRkwFwYDVQQDExBmZnIuZXUuYXV0aDAuY29tMIIBIjANBgkqhkiG9w0B
AQEFAAOCAQ8AMIIBCgKCAQEAqujqEcxQi+0v2jxCzt5pBL5CDh89av3O6mKrbB/F
ALUDkZ/kTHSGWyHSL2X9bOIeiixEjFXUReoC2PAtWwY92FSjkn3+3NRDRvP00sT4
MjsLoG1Wow7+kBS6PSaObWPlkSW5YU8Ss7KdWI5ayetqP7PIAH/c9v4kxlvg8Y+7
azyUrQs9GjFN8gqgr1+XfNLdODnolcnZLFEDl0PcMMYx4drg0eTn+442Om26lmHm
2AIcbM1VLwjPdtx5klqE+L6spTAErrMFzIY2iBnodFOUnRbs6h+Ctq0uQZwo7iQg
OE7RFAo3WZGOJNtppHjh7vPahMPMegLw+AJZXasYC/0P7wIDAQABo0IwQDAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBSLOR03eLqz/1NXqLFh+TRXQPAsiTAOBgNV
HQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAHRM5Wd/50UzsQGyczJTs6/N
ZjemkKapR80aulLqyRZfpm+fv/uAmCIvdKVb3QIhHPD/zn/9wgtOi4qcFS2YPntM
qNnZ1GoQz9Yio4lT0r51Hvxd5cmFd6jZt62hCgJnE5aj0z0a4b49ryH5NoqrvAXy
VYD53YaZmx1YdZaEOfoLVy+jKlM4A3sqL3tRKJWs7S/j6wQtIgJy0eAWbLeN3HbG
LjczZpj1H8l1awYEPUEQn76H6OlP/tlirXTyGIiTecUqoekcFPLsE0wY++ymoCUi
ZFIWQ2RgamlR5Y4pSYByQnx1MknZFb+wrqUH8QNrl6DGWWWtyvT1Zz79w/0Ggw0=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
