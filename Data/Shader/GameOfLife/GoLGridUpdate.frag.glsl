precision highp float;

varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 

uniform sampler2D texGrid;
uniform float windowWidth;
uniform float windowHeight;

uniform vec2 mousePos;
uniform bool applyInteraction;
uniform float curInteractionRadius;


bool isAlive()
{
	return texture2D(texGrid, vec2(vTexture.s, 1.0-vTexture.t)).x > 0.0;
}

int getNumAliveNeighbors()
{
	int num = 0;
	
	float step_x = 1.0 / windowWidth;
	float step_y = 1.0 / windowHeight;
	
	vec2 coords = vec2(vTexture.s, 1.0-vTexture.t) + vec2(step_x, step_y) / 2.0;
		
	if(texture2D(texGrid, coords + vec2(step_x,  0.0)).x > 0.0) ++num;
	if(texture2D(texGrid, coords + vec2(-step_x, 0.0)).x > 0.0) ++num;
	if(texture2D(texGrid, coords + vec2(0.0,  step_y)).x > 0.0) ++num;
	if(texture2D(texGrid, coords + vec2(0.0, -step_y)).x > 0.0) ++num;
	
	if(texture2D(texGrid, coords + vec2(step_x,   step_y)).x > 0.0) ++num;
	if(texture2D(texGrid, coords + vec2(step_x,  -step_y)).x > 0.0) ++num;
	if(texture2D(texGrid, coords + vec2(-step_x,  step_y)).x > 0.0) ++num;
	if(texture2D(texGrid, coords + vec2(-step_x, -step_y)).x > 0.0) ++num;

	return num;
}

void main() 
{    
	int numNeighbors = getNumAliveNeighbors();
	     

	float newState = 0.0;
	/*
	if(applyInteraction)
	{
		vec2 pos = vec2(vTexture.s, 1.0-vTexture.t) * vec2(windowWidth, windowHeight) - mousePos;
		
		float radius = curInteractionRadius;
		float circleWidth = 5.0;
		if(abs(length(pos) - radius) < circleWidth)
			newState = 1.0;
	}*/

	
    if(isAlive() )//|| newState == 1.0)
	{
		if(numNeighbors < 2)
			newState = 0.0;
		else if(numNeighbors < 4)
			newState = 1.0;
		else
			newState = 0.0;		
	}
	else
	{
		if(numNeighbors == 3)
			newState = 1.0;
	}
	
	//newState = 0.0;
	gl_FragColor = vec4(newState,0.0, 0.0, 1.0);
	
	/*
	 if (numNeighbors == 3) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else if (numNeighbors == 2) {
        float current = texture2D(texGrid, vec2(vTexture.s, 1.0-vTexture.t)).x;
        gl_FragColor = vec4(current, current, current, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}	*/
}