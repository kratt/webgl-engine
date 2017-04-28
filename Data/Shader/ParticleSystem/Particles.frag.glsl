precision mediump float;

varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform sampler2D texSprite;
uniform sampler2D texPos;


void main() 
{    
	float curLifeTime = texture2D(texPos, vTexture.xy).w;
	
	float alpha = 1.0 - curLifeTime;
	vec4 texColor = texture2D(texSprite, gl_PointCoord);
	vec4 color = vec4(0.08, 0.01, 0.5, 0.9); // 0.3;
	
	texColor.a = 0.01;
	
	texColor.b = 0.5;
	gl_FragColor = vec4(texColor);
	//gl_FragColor = vec4(0.08, 0.01, 0.5, 1.0);
	
	//gl_FragColor = vec4(1.0, 1.0, 1.0, 0.7);
	
	// !! euler lorenz!!
	//gl_FragColor = vec4(0.4, 0.01, 0.08, 0.15);// * 1.4;
}
