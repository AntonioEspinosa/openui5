(function () {
	'use strict';

	<!-- use the sinon faketimers for this test -->
	sinon.config.useFakeTimers = true;

	module("Properties");

	var oEmptyCarousel = new sap.m.Carousel("empty_carousel");

	test("Default Values", function () {
		// without parameter
		strictEqual(oEmptyCarousel.getLoop(), false, "Default 'loop' value is wrong");
		strictEqual(oEmptyCarousel.getWidth(), '100%', "Default 'width' value is wrong");
		strictEqual(oEmptyCarousel.getHeight(), '100%', "Default 'height' value is wrong");
		strictEqual(oEmptyCarousel.getVisible(), true, "Default 'loop' value is wrong");
		equal(oEmptyCarousel.getActivePage(), null, "Default 'activePage' value is wrong");
	});

	module("Methods");
//images for first carousel
	var img1 = new sap.m.Image("myPage1", {
			src: "../images/demo/nature/desert.jpg"
		}),
		img2 = new sap.m.Image("myPage2", {
			src: "../images/demo/nature/elephant.jpg"
		}),
		img3 = new sap.m.Image("myPage3", {
			src: "../images/demo/nature/fish.jpg"
		}),
		img4 = new sap.m.Image("myPage4", {
			src: "../images/demo/nature/forest.jpg"
		}),
		img5 = new sap.m.Image("myPage5", {
			src: "../images/demo/nature/huntingLeopard.jpg"
		}),
		img6 = new sap.m.Image("myPage6", {
			src: "../images/demo/nature/prairie.jpg"
		});
//images for second carousel
	var img11 = new sap.m.Image("myPage11", {
			src: "../images/demo/nature/desert.jpg"
		}),
		img21 = new sap.m.Image("myPage21", {
			src: "../images/demo/nature/elephant.jpg"
		}),
		img31 = new sap.m.Image("myPage31", {
			src: "../images/demo/nature/fish.jpg"
		}),
		img41 = new sap.m.Image("myPage41", {
			src: "../images/demo/nature/forest.jpg"
		}),
		img51 = new sap.m.Image("myPage51", {
			src: "../images/demo/nature/huntingLeopard.jpg"
		}),
		img61 = new sap.m.Image("myPage61", {
			src: "../images/demo/nature/prairie.jpg"
		});
//the first pucture carousel
	var oPictureCarousel = new sap.m.Carousel("picture_carousel", {
			activePage: "myPage1",
			height: "100%",
			width: "100%",
			pages: [img1, img2, img3, img4, img5, img6]
		}),
		oApp = new sap.m.App("testCarouselApp", {initialPage: "myPageApp"}),
		oPageApp = new sap.m.Page("myPageApp", {title: "Carousel Test Page", enableScrolling: false});

	var fnTestMove = function (iIndex, iIndicator) {
		var actIndicator = iIndicator ? iIndicator : iIndex;
		ok(this.$().find("#myPage" + iIndex).parents('.sapMCrslActive').length == 1, "Page " + iIndex + " should be active");
		if (this.getPages().length > 1) {
			ok(this.$().find(".sapMCrslBulleted :nth-child(" + actIndicator + ")").hasClass('sapMCrslActive'), "Page Indicator " + actIndicator + " should still be selected");
		} else {
			ok(this.$().find('.sapMCrslBulleted').length == 0, "Page Indicator should be hidden");
		}

	};

	oPageApp.addContent(oPictureCarousel);
	oApp.addPage(oPageApp);
	oApp.placeAt("carousel-test-content");
//act
	sap.ui.getCore().applyChanges();

	test("Move active page", function () {
		equal(oPictureCarousel.getActivePage(), "myPage1", "Default 'activePage' value is wrong");
		oPictureCarousel.setActivePage("myPage6");

		this.clock.tick(600);

		fnTestMove.call(oPictureCarousel, 6);
		oPictureCarousel.setActivePage("myPage1");

		this.clock.tick(600);

		fnTestMove.call(oPictureCarousel, 1);
		oPictureCarousel.setActivePage("myPage3");

		this.clock.tick(600);

		fnTestMove.call(oPictureCarousel, 3);
	});

	test("Next, Previous", function () {
		oPictureCarousel.previous();
		oPictureCarousel.previous();

		this.clock.tick(600);

		fnTestMove.call(oPictureCarousel, 1);
		oPictureCarousel.previous();

		this.clock.tick(600);

		fnTestMove.call(oPictureCarousel, 1);
		for (var i = 0; i < 5; i++) {
			oPictureCarousel.next();
		}
		;

		this.clock.tick(600);

		fnTestMove.call(oPictureCarousel, 6);
		oPictureCarousel.next();

		this.clock.tick(600);

		fnTestMove.call(oPictureCarousel, 6);
	});

	test("Loop", function () {
		oPictureCarousel.setLoop(true);
		oPictureCarousel.next();

		this.clock.tick(600);

		fnTestMove.call(oPictureCarousel, 1);
		oPictureCarousel.previous();

		this.clock.tick(600);

		fnTestMove.call(oPictureCarousel, 6);
	});


	test("Carousel Visibility", function () {
		oPictureCarousel.setVisible(false);

		this.clock.tick(600);

		ok(oPictureCarousel.$().length === 0, "Carousel should deleted from DOM");
		oPictureCarousel.setVisible(true);

		this.clock.tick(600);

		fnTestMove.call(oPictureCarousel, 6);
	});


	test("Page Indicator Visibility", function () {
		var originalDisplayValue = oPictureCarousel.$().find(".sapMCrslBulleted").css('display');
		oPictureCarousel.setShowPageIndicator(false);

		this.clock.tick(600);

		ok(oPictureCarousel.$().find(".sapMCrslBulleted").css('display') == 'none', "Page Indicator should be invisible");
		oPictureCarousel.setShowPageIndicator(true);

		this.clock.tick(600);

		ok(oPictureCarousel.$().find(".sapMCrslBulleted").css('display') == originalDisplayValue, "Page Indicator should be visible again");
	});

	test("Page Indicator Position", function () {
		oPictureCarousel.setPageIndicatorPlacement(sap.m.PlacementType.Top);
		ok(oPictureCarousel.$().children().first().hasClass('sapMCrslBulleted'), "Page Indicator should be on top");
		oPictureCarousel.setPageIndicatorPlacement(sap.m.PlacementType.Bottom);
		ok(oPictureCarousel.$().children().last().hasClass('sapMCrslBulleted'), "Page Indicator should be at bottom");
	});

	test("Removing Pages", function () {
		var oRemovedPage = oPictureCarousel.removePage(img6);
		ok(oRemovedPage.getId() === 'myPage6', "'removePage' does not return correct page");

		oPictureCarousel.removePage(img5);
		oPictureCarousel.removePage(img4);
		oPictureCarousel.removePage(img3);
		oPictureCarousel.removePage(img2);

		this.clock.tick(600);

		fnTestMove.call(oPictureCarousel, 1);
		oPictureCarousel.addPage(img5);

		this.clock.tick(600);

		oPictureCarousel.next();

		this.clock.tick(600);

		fnTestMove.call(oPictureCarousel, 5, 2);
		oPictureCarousel.addPage(img6);

		this.clock.tick(600);

		oPictureCarousel.next();

		this.clock.tick(600);

		fnTestMove.call(oPictureCarousel, 6, 3);
		oPictureCarousel.removePage(img1);
	});

	test("Add a second carousel", function () {
		oEmptyCarousel.addPage(img11);
		oEmptyCarousel.addPage(img21);
		oEmptyCarousel.addPage(img31);
		oEmptyCarousel.setHeight('50%');
		oPictureCarousel.setHeight('50%');
		oPictureCarousel.setLoop(false);
		oPageApp.addContent(oEmptyCarousel);
		sap.ui.getCore().applyChanges();
		ok(oEmptyCarousel.$().length === 1, "Second carousel should have been added");
		oEmptyCarousel.insertPage(img41, 2);
		oEmptyCarousel.insertPage(img51, 2);
		oEmptyCarousel.insertPage(img61, 2);
	});

	test("Remove all pages from carousel and add pages which were used in other carousel. AddCustom style", function () {
		//Arrange
		var oCarousel = new sap.m.Carousel({
			pages: [
				new sap.m.Page(),
				new sap.m.Page()
			]
		});

		// System under Test
		oCarousel.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		var allPages = oCarousel.removeAllPages();
		ok(allPages.length === 2, "'removeAllPages' does not return correct page array");

		this.clock.tick(800);

		ok(oCarousel.$().find('.sapMCrslInner').children().length === 0, "Second Carousel should deleted from DOM");

		oCarousel.addPage(img11);
		oCarousel.addStyleClass('TestClass');

		this.clock.tick(600);

		ok(oCarousel.$().find("#myPage11").parents('.sapMCrslActive').length == 1, "Page 11 should be active");
		ok(oCarousel.$().find('.sapMCrslBulleted').length == 0, "Page Indicator should be hidden");
		ok(oCarousel.$().hasClass("TestClass"), "Carousel has custom style class");
		var whoAmI = oCarousel.destroyPages();
		ok(whoAmI === oCarousel, "'destroyPages' does not return carousel");

		//Cleanup
		oCarousel.destroy();
	});

	module("Events");

	test("Listen to 'pageChanged' event", function () {
		//Arrange
		var oCarousel = new sap.m.Carousel({
			pages: [
				new sap.m.Page("keyTestPage_1"),
				new sap.m.Page("keyTestPage_2"),
				new sap.m.Page("keyTestPage_3"),
				new sap.m.Page("keyTestPage_4")
			],
			activePage: "keyTestPage_1"
		});

		oCarousel.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		var bPageNewOK = false,
			bPageOldOK = false;

		oCarousel.attachPageChanged(function (oControlEvent) {
			bPageNewOK = oControlEvent.getParameters().oldActivePageId == 'keyTestPage_1';
			bPageOldOK = oControlEvent.getParameters().newActivePageId == 'keyTestPage_2';
		});

		oCarousel.next();

		this.clock.tick(600);

		ok(bPageNewOK, "Old active page should be 'keyTestPage_1'");
		ok(bPageOldOK, "New active page should be 'keyTestPage_2'");

		//Clean up
		oCarousel.destroy();
	});

	test("Should fire pageChanged only once when using 'setActivePage' (CSN 0120061532 0001323934 2014)", function () {
		//Arrange
		//System under Test
		var sut = new sap.m.Carousel({
				pages: [new sap.m.Page('firePage1'), new sap.m.Page('firePage2')]
			}),
			oChangePageSpy = this.spy(sut, "_changePage");

		sut.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		sut.setActivePage('firePage2');

		//Act
		this.clock.tick(600);

		//Assert
		ok(oChangePageSpy.calledOnce, "PageChanged fired once");

		//Clean up
		sut.destroy();
	});

	test("Active page should be set when specified in constructor'", function () {
		//Arrange
		//System under Test
		var sut = new sap.m.Carousel({
			activePage: 'activePage2',
			pages: [new sap.m.Page('activePage1'), new sap.m.Page('activePage2')]
		});

		sut.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		//Assert
		ok(sut.getActivePage() == 'activePage2', "Active page should be 'activePage2'");

		//Clean up
		sut.destroy();
	});

	test("Should fire pageChanged only once even if it is invalidated meanwhile", function () {
		// Arrange
		var callCount = 0,
			oNestedCarousel = new sap.m.Carousel({
				pages: [new sap.m.Page()]
			}),
			oPageOfNestedCarousel = new sap.m.Page({
				content: oNestedCarousel
			});


		// System under Test
		var oCarousel = new sap.m.Carousel({
			pages: [oPageOfNestedCarousel, new sap.m.Page()]
		});

		// Act
		oCarousel.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oCarousel.attachPageChanged(shouldOnlyBeCalledOnce);
		oCarousel.next();

		function shouldOnlyBeCalledOnce() {
			callCount++;

			if (callCount === 1) {
				//Act part 2;
				oNestedCarousel.invalidate();
				//The bug that is tested here triggered a recursion at this point.
				sap.ui.getCore().applyChanges();
			}

			// Assert
			strictEqual(callCount, 1, "Did only call it once");

			//Cleanup
			oCarousel.destroy();
		}
	});

	module("Clean up");
	test("Destroy both carousels", function () {
		oPictureCarousel.destroy();
		strictEqual(oPictureCarousel.$().length, 0, "Picture Carousel removed from DOM");
		ok(!oPictureCarousel._mScrollContainerMap, "Picture Carousel's container map has been cleaned up");
		oEmptyCarousel.destroy();
		strictEqual(oEmptyCarousel.$().length, 0, "Empty Carousel removed from DOM");
		ok(!oEmptyCarousel._mScrollContainerMap, "Empty Carousel's container map has been cleaned up");
		var oNotRenderedCarousel = new sap.m.Carousel();
		oNotRenderedCarousel.destroy();
		ok(!oNotRenderedCarousel._mScrollContainerMap, "Empty Carousel's container map has been cleaned up");
	});

	var DOM_RENDER_LOCATION = "qunit-fixture";
	QUnit.module("Keyboard", {
		setup: function () {
			this.oCarousel = new sap.m.Carousel({
				pages: [
					new sap.m.Page("keyTestPage1"),
					new sap.m.Page("keyTestPage2", {
						content: [
							new sap.m.Button(),
							new sap.m.Button(),
							new sap.m.Button()
						]
					}),
					new sap.m.Page("keyTestPage3"),
					new sap.m.Page("keyTestPage4"),
					new sap.m.Page("keyTestPage5"),
					new sap.m.Page("keyTestPage6"),
					new sap.m.Page("keyTestPage7"),
					new sap.m.Page("keyTestPage8"),
					new sap.m.Page("keyTestPage9"),
					new sap.m.Page("keyTestPage10"),
					new sap.m.Page("keyTestPage11"),
					new sap.m.Page("keyTestPage12")
				]
			});

			this.oCarousel.placeAt(DOM_RENDER_LOCATION);

			sap.ui.getCore().applyChanges();

			this.oCarousel.$().focus();
		},
		teardown: function () {
			this.oCarousel.destroy();
		}
	});

	QUnit.test("Arrow Right", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage2");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_RIGHT);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage3", "active page is keyTestPage3");
	});

	QUnit.test("Arrow Right on the last page", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage12");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_RIGHT);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage12", "active page stays keyTestPage12");
	});

	QUnit.test("Arrow Up", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage2");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_UP);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage3", "active page is keyTestPage3");
	});

	QUnit.test("Arrow Up last page", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage12");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_UP);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage12", "active page stays keyTestPage12");
	});

	QUnit.test("Arrow Left", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage2");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_LEFT);
		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage1", "active page is keyTestPage1");
	});

	QUnit.test("Arrow Left on first page", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage1");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_LEFT);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage1", "active page stays keyTestPage1");
	});

	QUnit.test("Arrow Down", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage2");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_DOWN);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage1", "active page is keyTestPage1");
	});

	QUnit.test("Arrow Down on first page", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage1");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_DOWN);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage1", "active page stays keyTestPage1");
	});

	QUnit.test("HOME", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage2");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.HOME);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage1", "active page is keyTestPage1");
	});

	QUnit.test("END", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage2");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.END);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage12", "active page is keyTestPage12");
	});

	QUnit.test("CTRL + ARROW_RIGHT", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage1");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_RIGHT, false, false, true);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage11", "active page is keyTestPage11");
	});

	QUnit.test("CTRL + ARROW_RIGHT less than 10 go to last page", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage5");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_RIGHT, false, false, true);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage12", "active page is keyTestPage12");
	});

	QUnit.test("CTRL + ARROW_UP", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage1");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_UP, false, false, true);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage11", "active page is keyTestPage11");
	});

	QUnit.test("CTRL + ARROW_UP less than 10 go to last page", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage5");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_UP, false, false, true);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage12", "active page is keyTestPage12");
	});

	QUnit.test("PAGE_UP", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage1");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.PAGE_UP);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage11", "active page is keyTestPage11");
	});

	QUnit.test("PAGE_UP on less than 10 go to last page", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage5");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.PAGE_UP);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage12", "active page is keyTestPage12");
	});

	QUnit.test("CTRL + ARROW_LEFT", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage12");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_LEFT, false, false, true);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage2", "active page is keyTestPage2");
	});

	QUnit.test("CTRL + ARROW_LEFT less than 10 goes to first page", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage5");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_LEFT, false, false, true);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage1", "active page is keyTestPage1");
	});

	QUnit.test("CTRL + ARROW_DOWN", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage2");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_DOWN, false, false, true);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage1", "active page is keyTestPage1");
	});

	QUnit.test("CTRL + ARROW_DOWN less than 10 goes to first page", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage5");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.ARROW_DOWN, false, false, true);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage1", "active page is keyTestPage1");
	});

	QUnit.test("PAGE_DOWN", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage12");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.PAGE_DOWN);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage2", "active page is keyTestPage2");
	});

	QUnit.test("PAGE_DOWN less than 10 goes to first page", function (assert) {
		// Arrange
		this.oCarousel.setActivePage("keyTestPage5");

		// Act
		qutils.triggerKeydown(this.oCarousel.$(), jQuery.sap.KeyCodes.PAGE_DOWN);

		// Assert
		assert.strictEqual(this.oCarousel.getActivePage(), "keyTestPage1", "active page is keyTestPage1");
	});

	QUnit.module("Container Padding Classes");

	QUnit.test("Container Padding Classes", function (assert) {
		// System under Test + Act
		var oContainer = new sap.m.Carousel({
				pages: [
					new sap.m.Page("keyTestPage1")
				]
			}),
			sContentSelector = ".sapMCrslInner > .sapMCrslItem > .sapMScrollCont > .sapMScrollContScroll",
			sResponsiveSize = (sap.ui.Device.resize.width <= 599 ? "0px" : (sap.ui.Device.resize.width <= 1023 ? "16px" : "16px 32px")),
			aResponsiveSize = sResponsiveSize.split(" "),
			$container,
			$containerContent;

		// Act
		oContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		oContainer.addStyleClass("sapUiNoContentPadding");
		$containerContent = oContainer.$().find(sContentSelector);

		// Assert
		strictEqual($containerContent.css("padding-left"), "0px", "The container has no left content padding when class \"sapUiNoContentPadding\" is set");
		strictEqual($containerContent.css("padding-right"), "0px", "The container has no right content padding when class \"sapUiNoContentPadding\" is set");
		strictEqual($containerContent.css("padding-top"), "0px", "The container has no top content padding when class \"sapUiNoContentPadding\" is set");
		strictEqual($containerContent.css("padding-bottom"), "0px", "The container has no bottom content padding when class \"sapUiNoContentPadding\" is set");

		// Act
		oContainer.removeStyleClass("sapUiNoContentPadding");
		oContainer.addStyleClass("sapUiContentPadding");

		// Assert
		strictEqual($containerContent.css("padding-left"), "16px", "The container has 1rem left content padding when class \"sapUiContentPadding\" is set");
		strictEqual($containerContent.css("padding-right"), "16px", "The container has 1rem right content padding when class \"sapUiContentPadding\" is set");
		strictEqual($containerContent.css("padding-top"), "16px", "The container has 1rem top content padding when class \"sapUiContentPadding\" is set");
		strictEqual($containerContent.css("padding-bottom"), "16px", "The container has 1rem bottom content padding when class \"sapUiContentPadding\" is set");

		// Act
		oContainer.removeStyleClass("sapUiContentPadding");
		oContainer.addStyleClass("sapUiResponsiveContentPadding");

		// Assert
		strictEqual($containerContent.css("padding-left"), (aResponsiveSize[1] ? aResponsiveSize[1] : aResponsiveSize[0]), "The container has " + sResponsiveSize + " left content padding when class \"sapUiResponsiveContentPadding\" is set (tested value depends on window size)");
		strictEqual($containerContent.css("padding-right"), (aResponsiveSize[1] ? aResponsiveSize[1] : aResponsiveSize[0]), "The container has " + sResponsiveSize + " right content padding when class \"sapUiResponsiveContentPadding\" is set (tested value depends on window size)");
		strictEqual($containerContent.css("padding-top"), aResponsiveSize[0], "The container has " + sResponsiveSize + " top content padding when class \"sapUiResponsiveContentPadding\" is set (tested value depends on window size)");
		strictEqual($containerContent.css("padding-bottom"), aResponsiveSize[0], "The container has " + sResponsiveSize + " bottom content padding when class \"sapUiResponsiveContentPadding\" is set (tested value depends on window size)");

		// Cleanup
		oContainer.destroy();
	});

})();
