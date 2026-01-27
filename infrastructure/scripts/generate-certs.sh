#!/bin/bash
set -e

# Directory for certificates
CERT_DIR="./pki"
mkdir -p $CERT_DIR

echo "Generating Root CA..."

# 1. Create Root Key
if [ ! -f "$CERT_DIR/rootCA.key" ]; then
    openssl genrsa -des3 -passout pass:changeit -out $CERT_DIR/rootCA.key 2048
fi

# 2. Create Root Certificate
if [ ! -f "$CERT_DIR/rootCA.crt" ]; then
    openssl req -x509 -new -nodes -key $CERT_DIR/rootCA.key -sha256 -days 1024 -out $CERT_DIR/rootCA.crt -passin pass:changeit -subj "/C=US/ST=State/L=City/O=University/CN=UniversityRootCA"
fi

echo "Generating Server Certificate..."

# 3. Create Server Key
if [ ! -f "$CERT_DIR/server.key" ]; then
    openssl genrsa -out $CERT_DIR/server.key 2048
fi

# 4. Create Certificate Signing Request (CSR) configuration
cat > $CERT_DIR/server.csr.cnf <<EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn

[dn]
C=US
ST=State
L=City
O=University
OU=IT
CN=*.local
EOF

# 5. Create Extension Configuration (SAN)
cat > $CERT_DIR/v3.ext <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = admin.local
DNS.2 = student.local
DNS.3 = library.local
DNS.4 = wso2is.com
DNS.5 = localhost
IP.1 = 127.0.0.1
EOF

# 6. Generate CSR
openssl req -new -key $CERT_DIR/server.key -out $CERT_DIR/server.csr -config $CERT_DIR/server.csr.cnf

# 7. Generate Signed Certificate
openssl x509 -req -in $CERT_DIR/server.csr -CA $CERT_DIR/rootCA.crt -CAkey $CERT_DIR/rootCA.key -CAcreateserial -out $CERT_DIR/server.crt -days 500 -sha256 -extfile $CERT_DIR/v3.ext -passin pass:changeit

echo "Certificates generated successfully in $CERT_DIR"
ls -l $CERT_DIR
