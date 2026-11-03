// 최적화된 웹사이트 스크립트
document.addEventListener("DOMContentLoaded", function () {
  // 상수 정의
  const CONSTANTS = {
    DESKTOP_BREAKPOINT: 768,
    SCROLL_THRESHOLD: 5,
    NAV_OFFSET: { desktop: 96, mobile: 64 },
    THROTTLE_DELAY: 16, // 60fps
    DEBOUNCE_DELAY: 150,
  };

  // DOM 요소 캐싱 (최적화)
  const elements = {
    nav: document.querySelector("nav"),
    menuToggle: document.getElementById("menu-toggle"),
    mobileMenuOverlay: document.getElementById("mobileMenuOverlay"),
    aiQuickTalkButtons: document.querySelectorAll(".ai-quick-talk-btn"),
    aiQuickTalkModal: document.getElementById("aiQuickTalkModal"),
    privacyPolicyButton: document.getElementById("privacyPolicyButton"),
    privacyPolicyModal: document.getElementById("privacyPolicyModal"),
    scrollDownBtn: document.getElementById("scrollDownBtn"),
    couponDownloadButtons: document.querySelectorAll(".coupon-download-btn"),
    couponDownloadModal: document.getElementById("couponDownloadModal"),
  };

  // 섹션과 네비게이션 링크 캐싱 + 위치 정보 캐싱
  const sections = ["home", "intro", "area", "service", "recruit", "contact"];
  const navLinks = {};
  const sectionElements = {};
  const sectionPositions = {}; // 위치 정보 캐싱

  sections.forEach((id) => {
    navLinks[id] = document.querySelector(`nav a[href="#${id}"]`);
    sectionElements[id] = document.getElementById(id);
  });

  const mobileMenuLinks = document.querySelectorAll("#mobileMenu a");

  // 공통 DOM 요소 캠싱 (중복 제거)
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  const allSections = document.querySelectorAll("section");
  const mainText = document.querySelector("#home");
  const tabButtons = document.querySelectorAll(".tab-menu [data-tab]");
  const tabContents = document.querySelectorAll(".tab-content");

  function activateTab(button) {
    const selectedContent = document.getElementById(button.dataset.tab);
    if (!selectedContent) return;

    tabButtons.forEach((tabButton) => {
      tabButton.classList.toggle("active", tabButton === button);
    });

    tabContents.forEach((content) => {
      content.hidden = content !== selectedContent;
    });
  }

  const defaultTabButton = document.querySelector(
    '.tab-menu [data-tab="bike"]',
  );
  if (defaultTabButton) activateTab(defaultTabButton);

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateTab(button);
      PositionManager.updatePositions();
      NavigationManager.updateActiveSection(window.scrollY);
    });
  });

  function throttle(func, limit) {
    let inThrottle = false;

    return function (...args) {
      if (inThrottle) return;

      func.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    };
  }

  // Debounce 유틸리티 함수
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 위치 캠싱 및 업데이트 관리
  const PositionManager = {
    updatePositions() {
      sections.forEach((id) => {
        const section = sectionElements[id];
        if (section) {
          sectionPositions[id] = {
            top: section.offsetTop,
            height: section.offsetHeight,
          };
        }
      });
    },

    init() {
      this.updatePositions();
    },
  };

  // 모바일 메뉴 관리 (단순화)
  function closeMobileMenu() {
    if (elements.menuToggle) elements.menuToggle.checked = false;
  }

  function closeAiQuickTalkModal() {
    if (elements.aiQuickTalkModal) elements.aiQuickTalkModal.hidden = true;
  }

  if (elements.aiQuickTalkButtons.length && elements.aiQuickTalkModal) {
    let aiQuickTalkModalOpener;

    elements.aiQuickTalkButtons.forEach((button) => {
      button.addEventListener("click", () => {
        aiQuickTalkModalOpener = button;
        elements.aiQuickTalkModal.hidden = false;
        elements.aiQuickTalkModal.querySelector(".modal__close")?.focus();
      });
    });

    elements.aiQuickTalkModal
      .querySelectorAll("[data-modal-close]")
      .forEach((closeButton) => {
        closeButton.addEventListener("click", () => {
          closeAiQuickTalkModal();
          aiQuickTalkModalOpener?.focus();
        });
      });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !elements.aiQuickTalkModal.hidden) {
        closeAiQuickTalkModal();
        aiQuickTalkModalOpener?.focus();
      }
    });
  }

  function closePrivacyPolicyModal() {
    if (elements.privacyPolicyModal) elements.privacyPolicyModal.hidden = true;
    document.body.classList.remove("is-modal-open");
  }

  if (elements.privacyPolicyButton && elements.privacyPolicyModal) {
    elements.privacyPolicyButton.addEventListener("click", () => {
      elements.privacyPolicyModal.hidden = false;
      document.body.classList.add("is-modal-open");
      elements.privacyPolicyModal.querySelector(".modal__close")?.focus();
    });

    elements.privacyPolicyModal
      .querySelectorAll("[data-privacy-modal-close]")
      .forEach((closeButton) => {
        closeButton.addEventListener("click", closePrivacyPolicyModal);
      });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !elements.privacyPolicyModal.hidden) {
        closePrivacyPolicyModal();
        elements.privacyPolicyButton.focus();
      }
    });
  }

  function closeCouponDownloadModal() {
    if (elements.couponDownloadModal)
      elements.couponDownloadModal.hidden = true;
  }

  if (elements.couponDownloadButtons.length && elements.couponDownloadModal) {
    let couponDownloadModalOpener;

    elements.couponDownloadButtons.forEach((button) => {
      button.addEventListener("click", () => {
        couponDownloadModalOpener = button;
        elements.couponDownloadModal.hidden = false;
        elements.couponDownloadModal.querySelector(".modal__close")?.focus();
      });
    });

    elements.couponDownloadModal
      .querySelectorAll("[data-modal-close]")
      .forEach((closeButton) => {
        closeButton.addEventListener("click", () => {
          closeCouponDownloadModal();
          couponDownloadModalOpener?.focus();
        });
      });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !elements.couponDownloadModal.hidden) {
        closeCouponDownloadModal();
        couponDownloadModalOpener?.focus();
      }
    });
  }

  const couponPrintArea = document.querySelector("#couponPrintArea");
  const couponPrintImage = document.querySelector("#couponPrintImage");

  if (elements.couponDownloadModal && couponPrintArea && couponPrintImage) {
    const printButtons = elements.couponDownloadModal.querySelectorAll(
      "[data-print-coupon]",
    );

    printButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const image = button.parentElement.querySelector("img");

        if (!image) {
          alert("인쇄할 이미지를 찾을 수 없습니다.");
          return;
        }

        try {
          // 선택한 이미지 경로 설정
          couponPrintImage.src = image.src;

          // 인쇄 영역 표시
          couponPrintArea.hidden = false;

          // 이미지 로드 및 디코딩 대기
          await couponPrintImage.decode();

          if (!couponPrintImage.naturalWidth) {
            throw new Error("이미지가 비어 있습니다.");
          }

          // 인쇄 대화상자 열기
          window.print();
        } catch (error) {
          console.error("쿠폰 인쇄 오류:", error);
          alert(
            "쿠폰 이미지를 불러오지 못했습니다. 이미지 경로를 확인해 주세요.",
          );

          couponPrintArea.hidden = true;
        }
      });
    });

    // 인쇄 대화상자를 닫은 후 인쇄 영역 숨기기
    window.addEventListener("afterprint", () => {
      couponPrintArea.hidden = true;
    });
  }

  // 네비게이션 스타일 관리
  const NavigationManager = {
    isDesktop: () => window.innerWidth >= CONSTANTS.DESKTOP_BREAKPOINT,
    currentState: null, // 상태 캐싱으로 불필요한 DOM 조작 방지
    activeSection: null,

    updateStyle(scrollY) {
      if (!elements.nav) return;

      const isScrolled = scrollY > CONSTANTS.SCROLL_THRESHOLD;
      const newState = isScrolled ? "scrolled" : "top";

      // 상태가 변경된 경우에만 DOM 업데이트
      if (this.currentState === newState) return;
      this.currentState = newState;

      const { nav } = elements;

      if (isScrolled) {
        // 스크롤 된 상태 - 어두운 배경
        nav.classList.add("bg-[#252525]");
        nav.classList.remove("bg-transparent");
      } else {
        // 최상단 상태 - 투명 배경
        nav.classList.add("bg-transparent");
        nav.classList.remove("bg-[#252525]");
      }
    },

    updateActiveSection(scrollY) {
      const scrollPos = scrollY + 100;
      let currentSection = null;

      // 캐싱된 위치 정보 사용 (성능 최적화)
      for (const sectionId of sections) {
        const position = sectionPositions[sectionId];
        if (
          position &&
          scrollPos >= position.top &&
          scrollPos < position.top + position.height
        ) {
          currentSection = sectionId;
          break;
        }
      }

      // 활성 섹션이 그대로라면 DOM을 수정하지 않음
      if (currentSection === this.activeSection) return;

      if (this.activeSection && navLinks[this.activeSection]) {
        navLinks[this.activeSection].classList.remove("nav-active");
      }

      if (currentSection && navLinks[currentSection]) {
        navLinks[currentSection].classList.add("nav-active");
      }

      this.activeSection = currentSection;
    },

    // 초기 상태 설정
    init() {
      this.currentState = null; // 강제로 초기 상태 설정
      this.activeSection = null;
      this.updateStyle(window.scrollY);
      this.updateActiveSection(window.scrollY);
    },

    // 리사이즈 시 상태 리셋 및 위치 업데이트
    reset() {
      if (this.activeSection && navLinks[this.activeSection]) {
        navLinks[this.activeSection].classList.remove("nav-active");
      }
      this.currentState = null;
      this.activeSection = null;
      PositionManager.updatePositions(); // 위치 정보 업데이트
      this.updateStyle(window.scrollY);
      this.updateActiveSection(window.scrollY);
    },
  };

  // 이벤트 리스너 등록 (최적화됨)
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  if (elements.mobileMenuOverlay) {
    elements.mobileMenuOverlay.addEventListener("click", closeMobileMenu);
  }

  // 스크롤 다운 버튼
  if (elements.scrollDownBtn && sectionElements.intro) {
    elements.scrollDownBtn.addEventListener("click", () => {
      const navOffset = NavigationManager.isDesktop()
        ? CONSTANTS.NAV_OFFSET.desktop
        : CONSTANTS.NAV_OFFSET.mobile;
      const offsetTop = sectionElements.intro.offsetTop - navOffset;
      window.scrollTo({
        top: offsetTop,
        left: 0,
        behavior: "smooth",
      });
    });
  }

  // 통합된 스크롤 이벤트 (최적화)
  const handleScroll = throttle(() => {
    const scrollY = window.scrollY;
    NavigationManager.updateStyle(scrollY);
    NavigationManager.updateActiveSection(scrollY);
  }, CONSTANTS.THROTTLE_DELAY);

  window.addEventListener("scroll", handleScroll, { passive: true });

  // 스무스 스크롤 링크 처리 (최적화)
  smoothScrollLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navOffset = NavigationManager.isDesktop()
          ? CONSTANTS.NAV_OFFSET.desktop
          : CONSTANTS.NAV_OFFSET.mobile;
        const offsetTop = target.offsetTop - navOffset;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // 스크롤 애니메이션 관리
  const ScrollAnimationManager = {
    observer: null,

    init() {
      // 모바일에서는 즉시 애니메이션 적용
      if (window.innerWidth < CONSTANTS.DESKTOP_BREAKPOINT) {
        this.showAllElements();
        return;
      }

      // PC에서만 Intersection Observer 사용
      this.setupObserver();
    },

    showAllElements() {
      allSections.forEach((section) => section.classList.add("animate"));
      if (mainText) mainText.classList.add("animate");
    },

    setupObserver() {
      if (this.observer) this.observer.disconnect();

      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      }, observerOptions);

      // 관찰할 요소들 등록 (캐싱된 요소 사용)
      const observeElements = [
        ...new Set([...allSections, mainText].filter(Boolean)),
      ];

      observeElements.forEach((element) => this.observer.observe(element));
    },

    reset() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      this.init();
    },
  };

  // 리사이즈 이벤트 통합 관리
  const ResizeManager = {
    init() {
      const debouncedResize = debounce(() => {
        NavigationManager.reset();
        ScrollAnimationManager.reset();
      }, CONSTANTS.DEBOUNCE_DELAY);

      window.addEventListener("resize", debouncedResize);
    },
  };

  // 초기화 함수들 실행
  function init() {
    PositionManager.init();
    NavigationManager.init();
    ScrollAnimationManager.init();
    ResizeManager.init();
  }

  init();

  const video = document.querySelector(".hero-video");
  const textItems = document.querySelectorAll(".rolling-text__track p");
  const container = document.querySelector(".rolling-text");

  if (!video || textItems.length < 3 || !container) return;

  const distance = () => Math.min(224, Math.max(96, window.innerWidth * 0.15));

  // 영상 10초 기준: 첫 문장 0초, 두 번째 4초, 세 번째 7초
  const captions = [
    { element: textItems[0], start: 0, end: 3, direction: 1 },
    { element: textItems[1], start: 3.5, end: 7, direction: 1 },
    { element: textItems[2], start: 7, end: 10, direction: -1 },
  ];

  function updateCaptions() {
    const actualDuration = video.duration;

    if (!Number.isFinite(actualDuration) || actualDuration <= 0) {
      requestAnimationFrame(updateCaptions);
      return;
    }

    // 실제 영상 길이에 맞춰 10초 타임라인 보정
    const scale = actualDuration / 10;
    const time = video.currentTime / scale;
    const moveDistance = distance();

    captions.forEach(({ element, start, end, direction }) => {
      const localTime = (time - start) / (end - start);

      if (localTime < 0 || localTime > 1) {
        element.style.opacity = "0";
        return;
      }

      // 왼쪽에서 오른쪽 또는 오른쪽에서 왼쪽으로 이동
      const progress = localTime;
      const offset = direction * (-moveDistance + 2 * moveDistance * progress);

      // 시작과 끝에서 자연스럽게 페이드
      const fade = Math.min(1, progress / 0.08, (1 - progress) / 0.08);

      element.style.transform = `translateX(calc(-50% + ${offset}px))`;
      element.style.opacity = Math.max(0, fade);
    });

    requestAnimationFrame(updateCaptions);
  }

  video.addEventListener("loadedmetadata", updateCaptions, {
    once: true,
  });

  updateCaptions();
});
