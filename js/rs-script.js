
document.addEventListener('DOMContentLoaded', () => {
	// Находим все элементы с классом .rs-btn
	const buttons = document.querySelectorAll('.rs-btn');

	buttons.forEach(button => {
		// Сохраняем текст кнопки
		const buttonText = button.textContent.trim();

		// Удаляем все текстовые узлы внутри кнопки, чтобы оставить только вложенные элементы (например, иконки)
		Array.from(button.childNodes).forEach(node => {
			if (node.nodeType === Node.TEXT_NODE) {
				button.removeChild(node);
			}
		});

		// Если есть текст, создаем новую структуру
		if (buttonText) {
			// Создаем контейнер для текстовых блоков
			const wrapDiv = document.createElement('div');
			wrapDiv.className = 'rs-btn__wrap';

			// Создаем три div с текстом и добавляем их в wrapDiv
			for (let i = 0; i < 3; i++) {
				const textDiv = document.createElement('div');
				textDiv.className = 'rs-btn__text';
				textDiv.textContent = buttonText;
				wrapDiv.appendChild(textDiv);
			}

			// Добавляем контейнер wrapDiv внутрь кнопки
			button.appendChild(wrapDiv);
		}
	});
});

/* ====================================
Проверка поддержки webp, добавление класса webp или no-webp для HTML
==================================== */
function isWebp() {
	// Проверка поддержки webp
	function testWebP(callback) {
		let webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}
	// Добавление класса _webp или _no-webp для HTML
	testWebP(function (support) {
		let className = support === true ? 'webp' : 'no-webp';
		document.documentElement.classList.add(className);
	});
}
isWebp()

/* ====================================
Проверка мобильного браузера
==================================== */
let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
/* Добавление класса touch для HTML если браузер мобильный */
function addTouchClass() {
	// Добавление класса _touch для HTML если браузер мобильный
	if (isMobile.any()) document.documentElement.classList.add('touch');
}
addTouchClass()

/* ====================================
Добавление loaded для HTML после полной загрузки страницы
==================================== */
function addLoadedClass() {
	window.addEventListener("load", function () {
		setTimeout(function () {
			document.documentElement.classList.add('loaded');
		}, 0);
	});
}
addLoadedClass()

document.addEventListener('DOMContentLoaded', () => {
	gsap.registerPlugin(ScrollTrigger);

	gsap.fromTo(
		".rs-numbers__bg", // Анимируемый элемент
		{
			xPercent: -150, // Начальная позиция по X
			yPercent: -150  // Начальная позиция по Y
		},
		{
			xPercent: -35.5, // Конечная позиция по X
			yPercent: -47,   // Конечная позиция по Y
			duration: 0.3,     // Длительность анимации (секунды)
			ease: "power2.out", // Тип easing
			scrollTrigger: {
				trigger: ".rs-numbers", // Триггер для запуска анимации
				start: "top bottom ",    // Позиция триггера (когда верх триггера достигает центра экрана)
				end: "bottom center",   // Конец действия триггера
				scrub: true,             // Привязка анимации к скроллу
				markers: 0,
			}
		}
	);
});

/* ====================================
Бегущая строка
==================================== */
function marquee() {
	const marquees = document.querySelectorAll('.marquee');

	marquees.forEach(marquee => {
		const list = marquee.querySelector('ul');
		const items = Array.from(list.querySelectorAll('li'));
		const speed = 1; // Скорость прокрутки бегущей строки
		let scrollAmount = 0; // Переменная для отслеживания текущего смещения

		// Вычисляем общую ширину всех элементов для создания бесшовного эффекта
		const totalWidth = items.reduce((acc, item) => acc + item.offsetWidth, 0);
		const resetOffset = totalWidth + 215; // Добавляем смещение для плавного сброса

		// Дублируем элементы один раз для создания бесшовного эффекта, добавляя их в конец списка
		list.style.width = `${totalWidth * 2}px`;
		items.forEach(item => {
			const clone = item.cloneNode(true);
			list.appendChild(clone);
		});

		function scrollMarquee() {
			// Определяем направление и обновляем смещение
			if (marquee.dataset.direction === "left") {
				scrollAmount -= speed;
			} else if (marquee.dataset.direction === "right") {
				scrollAmount += speed;
			}

			// Применяем трансформацию для плавной прокрутки
			list.style.transform = `translateX(${scrollAmount}px)`;

			// Сбрасываем прокрутку, добавляя смещение 215px для плавного эффекта
			if (Math.abs(scrollAmount) >= resetOffset) {
				scrollAmount = 0; // Смещение после сброса, чтобы избежать резкого скачка
			}

			requestAnimationFrame(scrollMarquee); // Рекурсивный вызов для плавной анимации
		}

		scrollMarquee();
	});
}
marquee()

/* ====================================
Инициализация карты
==================================== */
ymaps.ready(init);
function init() {
	if (document.querySelector('.map')) {
		const mapClasses = document.querySelectorAll('.map');
		mapClasses.forEach(mapClass => {
			ymaps.ready();
			let map = new ymaps.Map(mapClass, {
				controls: [],
				// Координаты центра карты
				center: branchData[0].location,
				// Уровень масштабирования
				zoom: 15,
			}, {
				suppressMapOpenBlock: true,
				balloonMaxWidth: 200,
				searchControlProvider: 'yandex#search'
			});

			let pinsCollection = new ymaps.GeoObjectCollection({}, {
				preset: 'islands#blueDotIcon', // дефолт метка
				draggable: false, // метки нельзя перемещать
				// iconLayout: 'default#imageWithContent', // указать данный тип макета.
				// iconImageHref: 'img/footer/map-pin.png', // cвоё изображение иконки метки.
				// iconImageSize: [36, 52], // размеры метки
				// iconImageOffset: [-18, -26], // смещение левого верхнего угла иконки
				// iconContentOffset: [0, 0], // cмещение слоя с содержимым относительно слоя с картинкой
			});

			for (let i = 0; i < branchData.length; i++) {
				let marks = new ymaps.Placemark(branchData[i].location, {
					// Зададим содержимое заголовка балуна.
					balloonContentHeader:
						`${branchData[i].address}`
					,

					// Зададим содержимое всплывающей подсказки.
					hintContent: `${branchData[i].address}`,
				},)
				pinsCollection.add(marks);
			}

			// Добавим метки на карту.
			map.geoObjects.add(pinsCollection);

			// Скрываем хинт при открытии балуна.
			map.events.add('balloonopen', function (e) {
				Map.hint.close();
			});

			// Закрываем балун по клику по карте
			map.events.add('click', e => e.get('target').balloon.close());
		});
	}
}

/* ====================================
Позиция sticky
==================================== */
function sticky() {
	let addWindowScrollEvent = false;
	function stickyBlock() {
		// data-sticky для родителя внутри которого прилипает блок *
		// data-sticky-header для родителя, учитываем высоту хедера
		// data-sticky-top="" для родителя, можно указать отступ сверху
		// data-sticky-bottom="" для родителя, можно указать отступ снизу
		// data-sticky-item для прилипающего блока *
		addWindowScrollEvent = true;

		function stickyBlockInit() {
			const stickyParents = document.querySelectorAll('[data-sticky]');

			if (stickyParents.length) {
				stickyParents.forEach(stickyParent => {
					let stickyConfig = {
						media: stickyParent.dataset.sticky ? parseInt(stickyParent.dataset.sticky) : null,
						top: stickyParent.dataset.stickyTop ? parseInt(stickyParent.dataset.stickyTop) : 0,
						bottom: stickyParent.dataset.stickyBottom ? parseInt(stickyParent.dataset.stickyBottom) : 0,
						header: stickyParent.hasAttribute('data-sticky-header') ? document.querySelector('header').offsetHeight : 0
					}
					stickyBlockItem(stickyParent, stickyConfig);
				});
			}
		}
		function stickyBlockItem(stickyParent, stickyConfig) {
			const stickyBlockItem = stickyParent.querySelector('[data-sticky-item]');
			const headerHeight = stickyConfig.header;
			const offsetTop = headerHeight + stickyConfig.top;
			const startPoint = stickyBlockItem.getBoundingClientRect().top + scrollY - offsetTop;

			document.addEventListener("windowScroll", stickyBlockActions);
			window.addEventListener("resize", stickyBlockActions);

			function stickyBlockActions(e) {
				const endPoint = (stickyParent.offsetHeight + stickyParent.getBoundingClientRect().top + scrollY) - (offsetTop + stickyBlockItem.offsetHeight + stickyConfig.bottom);
				let stickyItemValues = {
					position: "relative",
					bottom: "auto",
					top: "0px",
					left: "0px",
					width: "auto"
				}
				if (!stickyConfig.media || stickyConfig.media < window.innerWidth) {
					// if (offsetTop + stickyConfig.bottom + stickyBlockItem.offsetHeight < window.innerHeight) {
					if (offsetTop + stickyConfig.bottom) {
						if (scrollY >= startPoint && scrollY <= endPoint) {
							stickyItemValues.position = `fixed`;
							stickyItemValues.bottom = `auto`;
							stickyItemValues.top = `${offsetTop}px`;
							stickyItemValues.left = `${stickyBlockItem.getBoundingClientRect().left}px`; // Учесть разницу в ширине экрана?
							stickyItemValues.width = `${stickyBlockItem.offsetWidth}px`;
						} else if (scrollY >= endPoint) {
							stickyItemValues.position = `absolute`;
							stickyItemValues.bottom = `${stickyConfig.bottom}px`;
							stickyItemValues.top = `auto`;
							stickyItemValues.left = `0px`;
							stickyItemValues.width = `${stickyBlockItem.offsetWidth}px`;
						}
					}
				}
				stickyBlockType(stickyBlockItem, stickyItemValues);
			}
		}
		function stickyBlockType(stickyBlockItem, stickyItemValues) {
			stickyBlockItem.style.cssText = `position:${stickyItemValues.position};bottom:${stickyItemValues.bottom};top:${stickyItemValues.top};left:${stickyItemValues.left};width:${stickyItemValues.width};`;
		}
		stickyBlockInit();
	}
	stickyBlock()

	// При подключении модуля обработчик события запустится автоматически
	setTimeout(() => {
		if (addWindowScrollEvent) {
			let windowScroll = new Event("windowScroll");
			window.addEventListener("scroll", function (e) {
				document.dispatchEvent(windowScroll);
			});
		}
	}, 0);
}
function checkSticky() {
	if (document.querySelector('[data-sticky]') && (window.innerWidth > 991.98)) {
		sticky()
	}
}
window.addEventListener('load', checkSticky)
window.addEventListener('resize', checkSticky)

/* ====================================
Инициализация галереи
==================================== */
Fancybox.bind("[data-fancybox]", {
	// Your custom options
	// compact: false,
	// idle: false,

	// animated: false,
	// showClass: false,
	// hideClass: false,

	// dragToClose: false,
	// contentClick: false,

	// Images: {
	// 	// Disable animation from/to thumbnail on start/close
	// 	zoom: false,
	// },

	Thumbs: {
		type: 'classic',
	},

	// Toolbar: {
	// 	display: {
	// 		left: [],
	// 		middle: ['infobar'],
	// 		right: ['close'],
	// 	},
	// },
});

/* ====================================
Добавить картинкам draggable="false"
==================================== */
const imgs = document.getElementsByTagName('img');
for (let i = 0; i < imgs.length; i++) {
	imgs[i].setAttribute('draggable', false);
}

//========================================================================================================================================================

// Обработа медиа запросов из атрибутов 
function dataMediaQueries(array, dataSetValue) {
	// Получение объектов с медиа запросами
	const media = Array.from(array).filter(function (item, index, self) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(",")[0];
		}
	});
	// Инициализация объектов с медиа запросами
	if (media.length) {
		const breakpointsArray = [];
		media.forEach(item => {
			const params = item.dataset[dataSetValue];
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});
		// Получаем уникальные брейкпоинты
		let mdQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray = [];

		if (mdQueries.length) {
			// Работаем с каждым брейкпоинтом
			mdQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				// Объекты с нужными условиями
				const itemsArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				mdQueriesArray.push({
					itemsArray,
					matchMedia
				})
			});
			return mdQueriesArray;
		}
	}
}

// Уникализация массива
function uniqArray(array) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
	});
}

//========================================================================================================================================================
// Вспомогательные модули блокировки прокрутки
let bodyLockStatus = true;
let bodyLockToggle = (delay = 300) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay);
	} else {
		bodyLock(delay);
	}
}
let bodyUnlock = (delay = 300) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			document.documentElement.classList.remove("lock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}
let bodyLock = (delay = 300) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			// el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		document.documentElement.classList.add("lock");

		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}

//========================================================================================================================================================
// Вспомогательные модули плавного раскрытия и закрытия объекта
let _slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore ? target.style.removeProperty('height') : null;
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			!showmore ? target.style.removeProperty('overflow') : null;
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.hidden = target.hidden ? false : null;
		showmore ? target.style.removeProperty('height') : null;
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}
