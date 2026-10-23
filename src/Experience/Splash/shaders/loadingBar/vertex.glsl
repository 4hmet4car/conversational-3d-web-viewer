uniform float uProgress;

void main()
{
    vec3 newPosition = position;
    newPosition.x = sign(newPosition.x + 1.0) * uProgress * 2.0 - 1.0;
    gl_Position = vec4(newPosition, 1.0);
}