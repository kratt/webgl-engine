precision mediump float;

varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform sampler2D texColor;
uniform sampler2D texSprite;

void main() 
{    	
	float alpha = texture2D(texSprite, gl_PointCoord).x;
	
	vec3 color = texture2D(texColor, vTexture.xy).xyz;
	gl_FragColor = vec4(color, 1.0);
}
