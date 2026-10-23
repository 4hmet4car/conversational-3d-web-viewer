uniform sampler2D tDiffuse;
uniform sampler2D uNormalMap;
uniform vec2 uResolution;

varying vec2 vUv;

void main()
{
    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv = mod(uv, 0.999);
    vec3 normalColor = texture(uNormalMap, uv).xyz * 2.0 - 1.0;
    
    vec2 newUv = vUv + normalColor.xy * 0.1;
    vec4 color = texture(tDiffuse, newUv);

    vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
    float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
    color.rgb += lightness * 2.0;

    gl_FragColor = color;
}