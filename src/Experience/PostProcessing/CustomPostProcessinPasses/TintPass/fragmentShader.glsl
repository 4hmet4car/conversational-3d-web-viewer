uniform sampler2D tDiffuse;
uniform vec3 uTint;

varying vec2 vUv;

void main()
{
    vec4 color = texture(tDiffuse, vUv);
    color.rgb += uTint;

    gl_FragColor = color;
}