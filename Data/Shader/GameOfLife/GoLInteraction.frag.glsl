precision highp float;

varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture; 


uniform vec2 center;
uniform float windowWidth;
uniform float windowHeight;

uniform vec2 mousePos;
uniform bool applyInteraction;
uniform float curInteractionRadius;

void main() 
{    
	float scale = 0.1;

	if(applyInteraction)
	{
		vec2 pos = scale*vec2(vTexture.s, 1.0-vTexture.t) * vec2(windowWidth, windowHeight) - mousePos;
				
		float radius = curInteractionRadius;
		float circleWidth = 0.1;
		if(abs(length(pos) - radius) < circleWidth){
			gl_FragColor = vec4(vec3(1.0), 1.0);
		}
		else{
		discard;
		}
	}
	
	
	
}