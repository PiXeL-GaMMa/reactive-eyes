/*
	! *****************************************************************************
	
	REACTIVE EYES
	
	MIT License with Attribution

	Copyright (c) Colin J.D. Stewart. All rights reserved.
	
	The following license applies to this software and associated documentation 
	files (the "Software"):

	Permission is hereby granted, free of charge, to any person obtaining a copy 
	of this Software, to use, copy, modify, merge, publish, distribute, sublicense, 
	and/or sell copies of the Software, subject to the following conditions:

	1. 	The above copyright notice and this permission notice shall be included 
		in all copies or substantial portions of the Software.
		
	2. 	If you use this Software in a product or service, an attribution in the 
		form of a copyright notice, a link to the license, and a disclaimer of 
		warranties (and any other similar attribution) is required for any 
		distribution, reproduction, or derivative works of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
	THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR 
	OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, 
	ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
	OTHER DEALINGS IN THE SOFTWARE.
	
	! ***************************************************************************** 
*/

(function() {  
	const alleyes = document.querySelectorAll('.eye');
	
	if (alleyes.length > 0) {
		var focusX, focusY;
		var rFocusTimeout;
	
		// set up eyes
		alleyes.forEach(
			function (eye) {
				const iris = document.createElement("div");
				const pupil = document.createElement("div");
				iris.appendChild(pupil);
				eye.appendChild(iris);
				pupil.className = 'pupil';
				iris.className = 'iris';
			}
		);	
		
		// get min/max pupil size
		const eyesComputedStyle = getComputedStyle(alleyes[0].parentElement); // computed style of eyes
		const pupilWidth = [parseInt(eyesComputedStyle.getPropertyValue('--pupil-width-min')), parseInt(eyesComputedStyle.getPropertyValue('--pupil-width-max'))];
		const pupilHeight = [parseInt(eyesComputedStyle.getPropertyValue('--pupil-height-min')), parseInt(eyesComputedStyle.getPropertyValue('--pupil-height-max'))];
		
		document.querySelector("body").addEventListener("mousemove",
			function(e) {
				clearTimeout(rFocusTimeout);
		
				focusX = e.clientX;
				focusY = e.clientY;
				
				updateEyes();
				rFocusTimeout = setTimeout(setRandomFocus, 5000);
			}
		);
		
		// set the focus on a random point inside the inner window
		function setRandomFocus() {
			focusX = Math.random() * window.innerWidth;
			focusY = Math.random() * window.innerHeight;
			updateEyes();
			rFocusTimeout = setTimeout(setRandomFocus, 5000);
		}

		
		// the update function :)
		function updateEyes(e) {
			alleyes.forEach(
				function (eye) {
					var eyes = eye.parentElement;				
					var iris = eye.firstChild;
					var pupil = iris.firstChild;
					
					// calc dist of mouse to the centre of the eyes
					var dist = Math.floor(Math.sqrt(Math.pow(focusX - (eyes.offsetLeft+(eyes.offsetWidth/2)), 2) + Math.pow(focusY - (eyes.offsetTop+(eyes.offsetHeight/2)), 2)));				
					
					// if the distance is higher than 500px, clamp it
					if (dist > 500) dist = 500;
					
					// calculate the scaled range, scale 0 to 500 into 8 to 18
					var x = dist * (pupilWidth[1] - pupilWidth[0]) / 500 + pupilWidth[0];
					
					var y = dist * (pupilHeight[1] - pupilHeight[0]) / 500 + pupilHeight[0];
					
					pupil.style.width = x+'px';
					pupil.style.height = y+'px';	

					// now update the iris etc
					var eyeBounds = eye.getBoundingClientRect();	
					var boundsXoffset = (iris.clientWidth - x) / 2;
					var boundsYoffset = (iris.clientHeight - y) / 2;					
					
					x = (focusX - (eyeBounds.left + eye.clientWidth / 2)) / 2;
					y = (focusY - (eyeBounds.top + eye.clientHeight / 2)) / 2;		
					
					var boundx = (eye.clientWidth / 2 - iris.offsetWidth / 2) + (boundsXoffset / 1.80);
					var boundy = (eye.clientHeight / 2 - + iris.offsetHeight / 2) + (boundsYoffset / 1.80);
					
					if (x < -boundx) x = -boundx;
					else if (x > boundx) x = boundx;
					if (y < -boundy) y = -boundy;
					else if (y > boundy) y = boundy;
					
					iris.style.transform = "translate3d(" + x + "px," + y + "px, 0px)";
				}
			);
		}	

		rFocusTimeout = setTimeout(setRandomFocus, 5000);		
	}	
})(); 
