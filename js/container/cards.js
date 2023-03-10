import { basketData } from "../store.js";
import { createBtn } from "../utils/createBtn.js";
import { createElem } from "../utils/createElem.js";
import { setItem } from "../utils/setLocalItems.js";
import { itemWrapper, discountPriceNum, getSumOverall, discountRecalc } from "./basket.js";
import { toggleSpinner } from "./spinner.js"
import { basketCounter, counterCheck } from "./header.js";
import {modal} from "./modal.js";

const main = document.getElementById("main")

const cards = createElem("section", {
	className: "cards"
}, main)

const cardContainer = createElem("div", {
	className: "container"
}, cards)

const sectionTitle = createElem("h2", {
	className: "cards__title",
	textContent: "Хиты продаж"
}, cardContainer)

const searchResult = createElem("p", {
	className: "cards__search-res",
	textContent: "Результат поиска:"
}, cardContainer)

const nothingFound = createElem("p", {
	className: "cards__nothing-found",
	textContent: "Ничего не найдено",
}, cardContainer)

const cardsWrapper = createElem("div", {
	className: "cards__wrapper"
}, cardContainer)

const renderCard = (elem, to) => {
	const { id, imgSrc, price, discount, thing } = elem

	const cardWrapper = createElem("div", {
		className: "cards__card-wrapper"
	}, to)

	const cardWrapperTop = createElem("div", {
		className: "cards__card-wrapper-top",
	}, cardWrapper)

	const cardWrapperBottom = createElem("div", {
		className: "cards__card-wrapper-bottom",
	}, cardWrapper)

	const cardImg = createElem("img", {
		className: "cards__img",
		src: imgSrc,
		alt: thing
	}, cardWrapperTop)

	const discountBasketBtnWrapper = createElem("div", {
		className: "cards__discount-basket-wrapper",
	}, cardWrapperTop)

	const discountPercent = createElem("p", {
		className: "cards__discount-percent",
		textContent: `- ${discount}%`
	}, discountBasketBtnWrapper)

	const addToBasket = createBtn("Добавить в корзину", "cards__basket-add-btn", discountBasketBtnWrapper, "click", () => {
		basketData.push(elem)
		setItem(basketData)

		const itemDiv = createElem("div", {
			className: "itemContainer",
		}, itemWrapper)

		const itemPic = createElem("img", {
			className: "basket__img",
			src: imgSrc
		}, itemDiv)
		const itemText = createElem("p", {
			textContent: thing
		}, itemDiv)
		const itemPrice = createElem("p", {
			textContent: price + "р"
		}, itemDiv)

		const itemDelete = createBtn("X", "itemDelete", itemDiv, "click", (e) => {
			e.currentTarget.parentElement.remove()
			const deleteOneBlock = basketData.map(item => item.id)
			const deleteOneBlockIndex = deleteOneBlock.indexOf(id)
			basketData.splice(deleteOneBlockIndex, 1)
			discountRecalc()
			basketCounter.innerText = basketData.length
			counterCheck()
		})
		discountRecalc()
		basketCounter.innerText = basketData.length
		counterCheck()
		// todo
		let modalSuccess = modal({
			popUp: true,
			title: "✓ Товар успешно добавлен!"
		})
		modalSuccess.show()
		setTimeout(() => modalSuccess.hide(), 1000)
	})

	const quickView = createBtn("Быстрый просмотр", "cards__quick-view-btn", cardWrapperTop, "click", () => {
		modal({
			title: thing,
			src: imgSrc,
			discount: discount,
			price: price,
			// todo refactoring
			content: '<img src="imgSrc" alt="img error" style="display: block; height: auto; max-width: 100%;"><span>' +
				'Скидка: -discount% Цена: price p.</span>'
		}).show()
	})

	const discountPrice = createElem("p", {
		className: "cards__discount-price",
		textContent: `${(price / 100 * (100 - discount)).toFixed(2)} р.`
	}, cardWrapperBottom)

	const actualPrice = createElem("p", {
		className: "cards__actual-price",
		textContent: `${price} р.`
	}, cardWrapperBottom)

	const thingElem = createElem("p", {
		className: "cards__thing",
		textContent: thing
	}, cardWrapperBottom)
}

const cardData = () => {
	toggleSpinner()

	return fetch("https://63adfd3a3e4651691668d930.mockapi.io/clothesImg")
		.then(response => response.json())
		.then(data => {
			toggleSpinner()
			data.forEach(item => renderCard(item, cardsWrapper))
			return data
		})
}

cardData()
