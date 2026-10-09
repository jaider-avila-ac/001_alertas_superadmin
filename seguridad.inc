# cabeceras de seguridad (va en cada location: un add_header dentro de location borra los de afuera)
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
# solo se habla con el backend configurado. data: y blob: para los iconos y los qr que se generan en el navegador
add_header Content-Security-Policy "default-src 'self'; connect-src 'self' __API__ __WS__; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'" always;
