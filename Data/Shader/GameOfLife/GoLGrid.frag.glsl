precision highp float;

varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform sampler2D texGrid;
uniform vec2 center;
uniform float windowWidth;
uniform float windowHeight;


void main() 
{    
	float scale = 0.1;
	 
	float step_x = 1.0 / windowWidth;
	float step_y = 1.0 / windowHeight;
	
	vec2 center = vec2(vTexture.s, 1.0-vTexture.t) + vec2(step_x, step_y) / 2.0;
	/*
	const int size = 0;
	
	float avg = 0.0;
	for(int x = -size; x<=size; ++x)
	{
		for(int y = -size; y<=size; ++y)
		{
			vec2 curPos = center + vec2(float(x), float(y)) * vec2(step_x, step_y);	
			
			avg += texture2D(texGrid, curPos * scale).x;
		}
	}

	int num = (size+1) * (size+1);
	avg /= float(num);

	*/
	vec3 val = texture2D(texGrid, vTexture.st * scale).xyz;
	gl_FragColor = vec4(vec3(val.x), 1.0);
}