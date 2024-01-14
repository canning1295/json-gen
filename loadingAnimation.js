// Credit: https://codepen.io/jackrugile/pen/JddmaX

export function showLoadingAnimation() {
	// Create a new div to show the loading animation
	const loaderDiv = document.createElement("div");
	loaderDiv.innerHTML = htmlLoader;
	document.body.appendChild(loaderDiv);

	// Add a class to the body to indicate loading
	document.body.classList.add("body-disabled");
}

export function hideLoadingAnimation() {
	// Remove the loader div
	const loaderDiv = document.querySelector(".loader");
	if (loaderDiv) {
		loaderDiv.parentNode.removeChild(loaderDiv);
	}

	// Remove the class from the body
	document.body.classList.remove("body-disabled");
}

const htmlLoader =
	/*html*/
	`
    <div class="loader">
        <div class="loader-inner">
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
        </div>
    </div>
    <style>
        .loader {
        background: #000;
        background: radial-gradient(#222, #000);
        bottom: 0;
        left: 0;
        overflow: hidden;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 9999999;
    }

    .loader-inner {
        bottom: 0;
        height: 60px;
        left: 0;
        margin: auto;
        position: absolute;
        right: 0;
        top: 0;
        width: 100px;
    }

    .loader-line-wrap {
        animation: 
            spin 2000ms cubic-bezier(.175, .885, .32, 1.275) infinite
        ;
        box-sizing: border-box;
        height: 50px;
        left: 0;
        overflow: hidden;
        position: absolute;
        top: 0;
        transform-origin: 50% 100%;
        width: 100px;
    }
    .loader-line {
        border: 4px solid transparent;
        border-radius: 100%;
        box-sizing: border-box;
        height: 100px;
        left: 0;
        margin: 0 auto;
        position: absolute;
        right: 0;
        top: 0;
        width: 100px;
    }
    .loader-line-wrap:nth-child(1) { animation-delay: -50ms; }
    .loader-line-wrap:nth-child(2) { animation-delay: -100ms; }
    .loader-line-wrap:nth-child(3) { animation-delay: -150ms; }
    .loader-line-wrap:nth-child(4) { animation-delay: -200ms; }
    .loader-line-wrap:nth-child(5) { animation-delay: -250ms; }

    .loader-line-wrap:nth-child(1) .loader-line {
        border-color: hsl(0, 80%, 60%);
        height: 90px;
        width: 90px;
        top: 7px;
    }
    .loader-line-wrap:nth-child(2) .loader-line {
        border-color: hsl(60, 80%, 60%);
        height: 76px;
        width: 76px;
        top: 14px;
    }
    .loader-line-wrap:nth-child(3) .loader-line {
        border-color: hsl(120, 80%, 60%);
        height: 62px;
        width: 62px;
        top: 21px;
    }
    .loader-line-wrap:nth-child(4) .loader-line {
        border-color: hsl(180, 80%, 60%);
        height: 48px;
        width: 48px;
        top: 28px;
    }
    .loader-line-wrap:nth-child(5) .loader-line {
        border-color: hsl(240, 80%, 60%);
        height: 34px;
        width: 34px;
        top: 35px;
    }

    @keyframes spin {
        0%, 15% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    </style>
`;