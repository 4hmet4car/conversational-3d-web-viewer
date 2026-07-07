#include <map_fragment>

vec4 paintTexture = texture2D( uPaintDiffuseTexture, vUv );

diffuseColor *= 1.0-paintTexture.a;
diffuseColor += paintTexture;