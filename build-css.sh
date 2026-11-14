#!/bin/bash
# Gera css/app.min.css (bundle + minificado) a partir de css/styles.css.
# Rode sempre que editar qualquer arquivo em css/ (exceto app.min.css).
npx --yes lightningcss-cli --minify --bundle css/styles.css -o css/app.min.css
