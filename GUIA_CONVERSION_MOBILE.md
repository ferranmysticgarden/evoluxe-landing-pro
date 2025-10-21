# Guía para Convertir la App a APK/AAB (Android) e IPA (iOS)

Esta guía te ayudará a convertir tu aplicación web Evoluxe's Project en una app nativa para Android e iOS usando Capacitor.

## Requisitos Previos

### Para Android:
- Node.js instalado (v16 o superior)
- Android Studio instalado
- Java JDK 11 o superior

### Para iOS (solo en Mac):
- macOS
- Xcode instalado
- CocoaPods instalado (`sudo gem install cocoapods`)

## Paso 1: Instalar Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
```

## Paso 2: Inicializar Capacitor

```bash
npx cap init
```

Cuando te pregunte:
- **App name**: Evoluxe's Project
- **App ID**: com.evoluxe.seo (o tu propio dominio invertido)
- **Web directory**: dist

## Paso 3: Construir la Aplicación Web

```bash
npm run build
```

## Paso 4: Añadir Plataformas

### Para Android:
```bash
npx cap add android
```

### Para iOS:
```bash
npx cap add ios
```

## Paso 5: Sincronizar el Proyecto

```bash
npx cap sync
```

## Paso 6: Abrir en IDE Nativo

### Para Android:
```bash
npx cap open android
```

Esto abrirá Android Studio. Desde allí:
1. Espera a que Gradle termine de sincronizar
2. Ve a `Build > Build Bundle(s) / APK(s)`
3. Selecciona `Build APK` para desarrollo o `Build Bundle` para publicar en Google Play
4. El APK/AAB se generará en `android/app/build/outputs/`

### Para iOS:
```bash
npx cap open ios
```

Esto abrirá Xcode. Desde allí:
1. Selecciona tu dispositivo o simulador
2. Ve a `Product > Archive` para crear un archivo para la App Store
3. O simplemente presiona el botón de Play para probar en simulador

## Paso 7: Configuración Adicional

### Iconos y Splash Screen

Los iconos ya están configurados en `public/icon-192.png` y `public/icon-512.png`. 

Para personalizar más:
1. Visita: https://capacitorjs.com/docs/guides/splash-screens-and-icons
2. Usa herramientas como https://www.appicon.co/ para generar todos los tamaños

### Permisos (Android)

Edita `android/app/src/main/AndroidManifest.xml` y añade los permisos necesarios:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### Configuración de Info.plist (iOS)

Edita `ios/App/App/Info.plist` para configurar permisos y comportamiento.

## Paso 8: Publicar en Tiendas

### Google Play Store:
1. Crea una cuenta de desarrollador en https://play.google.com/console
2. Genera un APK firmado desde Android Studio
3. Sube el Bundle (AAB) a Google Play Console
4. Completa la información de la tienda y publica

### Apple App Store:
1. Únete al Apple Developer Program ($99/año)
2. Crea un App ID en https://developer.apple.com
3. Archive la app desde Xcode
4. Sube a App Store Connect
5. Completa la información y envía para revisión

## Comandos Útiles

```bash
# Actualizar después de cambios en el código web
npm run build
npx cap sync

# Ver logs en tiempo real
npx cap run android --livereload
npx cap run ios --livereload

# Limpiar y reconstruir
npx cap sync --clean
```

## Solución de Problemas

### Error de Gradle (Android)
Si tienes errores con Gradle, asegúrate de tener instalado Java 11+:
```bash
java -version
```

### Error de CocoaPods (iOS)
Si los pods fallan:
```bash
cd ios/App
pod install --repo-update
```

### La app no carga contenido
Verifica que en `capacitor.config.json` el `webDir` apunte a `dist`:
```json
{
  "webDir": "dist"
}
```

## Recursos Adicionales

- Documentación oficial de Capacitor: https://capacitorjs.com/docs
- Guía de Android Studio: https://developer.android.com/studio/build/building-cmdline
- Guía de Xcode: https://developer.apple.com/documentation/xcode

## Notas Importantes

1. **Siempre ejecuta `npm run build` antes de `npx cap sync`** para asegurar que los cambios web se reflejen en la app móvil.

2. **Para desarrollo rápido**, usa el modo livereload:
   ```bash
   npx cap run android --livereload --external
   ```

3. **La app ya está configurada como PWA**, por lo que los usuarios pueden instalarla directamente desde el navegador sin necesidad de las tiendas de apps.

4. **Stripe y Supabase** funcionarán automáticamente en la versión móvil ya que usan llamadas HTTP estándar.

5. **Antes de publicar**, asegúrate de:
   - Cambiar todos los iconos y splash screens
   - Actualizar el `capacitor.config.json` con tu información
   - Probar en dispositivos físicos, no solo emuladores
   - Revisar las políticas de privacidad (ya incluidas en la app)
