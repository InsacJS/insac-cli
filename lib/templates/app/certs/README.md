# Generación de claves pública y privada.

### Paso 1.
Crear la clave privada (privateKey.pem).

$ `openssl genrsa -out privatekey.pem 2048`

### Paso 2.
Crear un archivo de Solicitud de Firma de Certificado (.csr).

$ `openssl req -new -key privatekey.pem -out server.csr`

### Paso 3.
Crear la clave pública (.pem).

$ `openssl x509 -req -in server.csr -signkey privatekey.pem -out publicKey.pem`

### Referencias

- [Cómo crear un certificado SSL de firma propia con OpenSSL y Apache HTTP Server](https://www.nanotutoriales.com/como-crear-un-certificado-ssl-de-firma-propia-con-openssl-y-apache-http-server)

- [Creación de CSR utilizando OpenSSL en Apache](https://www.digicert.com/es/creacion-de-sfc-apache.htm)
