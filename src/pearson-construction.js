import 'focus-visible';
import Swiper from 'swiper';
import SwiperCore, { Autoplay, EffectFade, Pagination } from 'swiper/core';

document.addEventListener('DOMContentLoaded', () => {
	Array.from(document.querySelectorAll('input,textarea')).forEach((input) => {
		input.addEventListener('blur', (event) => {
			event.target
				.closest('.form-field')
				.classList.add('form-field--touched');
		});
	});

	var phAndEmail = Array.from(document.querySelectorAll('#email,#phone'));
	phAndEmail.forEach((input) => {
		input.addEventListener('input', (event) => {
			phAndEmail.forEach((inpt) => {
				if (inpt === event.target) {
					return;
				}
				inpt.required = !event.target.value.length;
			});
		});
	});

	document.forms[0].addEventListener('submit', (event) => {
		event.preventDefault();

		const form = event.target;
		const formMessage = document.getElementById('form-message');
		const submitBtn = document.querySelector('button');
		submitBtn.disabled = true;

		const xhr = new XMLHttpRequest();
		xhr.open(form.method, form.action);
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.onreadystatechange = () => {
			if (xhr.readyState !== XMLHttpRequest.DONE) return;
			if (xhr.status === 200) {
				formMessage.innerText = 'Your message has been sent!';
				formMessage.classList = 'form-message--success';
				form.reset();
				Array.from(
					document.getElementsByClassName('form-field--touched')
				).forEach((el) => el.classList.remove('form-field--touched'));
			} else {
				formMessage.innerText =
					'There was a problem sending your message, please try again.';
				formMessage.classList = 'form-message--error';
			}
			submitBtn.disabled = false;
		};
		xhr.send(new FormData(form));
	});

	setTimeout(() => {
		const wrapper = document.querySelector('.swiper-wrapper');
		for (const img of document.getElementsByClassName('additional-image')) {
			wrapper.appendChild(img.content);
		}
		SwiperCore.use([Pagination, EffectFade, Autoplay]);
		const swiper = new Swiper('.swiper-container', {
			slidesPerView: 1,
			loop: true,
			autoplay: {
				delay: 7000,
				disableOnInteraction: false,
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
				bulletElement: 'button',
				renderBullet: function (index, className) {
					return (
						'<button class="' +
						className +
						'"><span>View image ' +
						(index + 1) +
						'</span></button>'
					);
				},
			},
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			a11y: {
				enabled: true,
				containerMessage: 'Photos from Pearson Construction jobs',
				firstSlideMessage: 'First image',
				lastSlideMessage: 'Last image',
				nextSlideMessage: 'Next image',
				prevSlideMessage: 'Previous image',
				paginationBulletMessage: 'Go to image {{index}}',
			},
		});
	}, 1000);

	if (process.env.NODE_ENV === 'production') {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/service-worker.js');
		}
	}
});
