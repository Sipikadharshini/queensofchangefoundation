/* ==========================================================================
   Queens Of Change Foundation - Interactive Script Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Header & Navigation Controller
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.main-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  
  // Header scroll scale down
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile navigation panel
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    
    // Burger animation to 'X'
    const bars = mobileToggle.querySelectorAll('.bar');
    if (isOpen) {
      bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    }
  }

  mobileToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile navigation on clicking any link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });


  /* --------------------------------------------------------------------------
     2. Dark Mode Toggle System
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggle');
  
  // Check and apply saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Toggle event
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Smooth micro-animation click effect
    themeToggleBtn.style.transform = 'scale(0.9) rotate(30deg)';
    setTimeout(() => {
      themeToggleBtn.style.transform = 'none';
    }, 200);
  });

  // Watch for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });


  /* --------------------------------------------------------------------------
     3. Scroll-Reveal Controller (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop tracking once revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* --------------------------------------------------------------------------
     4. Dynamic Count-Up Statistics
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsTriggered = false;

  function countUp(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds counting speed
    const start = 0;
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing curve (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeProgress * (target - start) + start);
      
      // Clean formatting for Indian Numbering System (e.g. 2,00,000)
      if (target >= 100000) {
        el.textContent = currentVal.toLocaleString('en-IN');
      } else {
        el.textContent = currentVal.toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        // Double-check target value is exact
        el.textContent = target >= 100000 ? target.toLocaleString('en-IN') : target.toLocaleString();
      }
    }

    requestAnimationFrame(updateNumber);
  }

  // Observer to start stats dynamic counting on scroll into view
  const statsSection = document.getElementById('impact');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsTriggered) {
          statsNumbers.forEach(num => countUp(num));
          statsTriggered = true;
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    statsObserver.observe(statsSection);
  }


  /* --------------------------------------------------------------------------
     4.1 Slum Adoptions Interactive Controller
     -------------------------------------------------------------------------- */
  const slumZoneCards = document.querySelectorAll('.slum-zone-card');
  const reportTitle = document.getElementById('reportTitle');
  const reportFamilies = document.getElementById('reportFamilies');
  const reportPads = document.getElementById('reportPads');
  const reportWorkshops = document.getElementById('reportWorkshops');

  const slumDataMap = {
    lucknow: {
      title: 'Lucknow Slum Hub Impact',
      families: '1,200+',
      pads: '45,000+',
      workshops: '120+'
    },
    kanpur: {
      title: 'Kanpur Central Slums Impact',
      families: '950+',
      pads: '38,000+',
      workshops: '98+'
    },
    delhi: {
      title: 'Noida-Delhi Border camps Impact',
      families: '1,500+',
      pads: '62,000+',
      workshops: '160+'
    },
    jaipur: {
      title: 'Jaipur Slum Enclaves Impact',
      families: '780+',
      pads: '29,000+',
      workshops: '74+'
    }
  };

  slumZoneCards.forEach(card => {
    card.addEventListener('click', () => {
      // Toggle active states
      slumZoneCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Fetch matching details
      const zoneKey = card.getAttribute('data-zone');
      const data = slumDataMap[zoneKey];

      if (data) {
        // Quick visual fade out, update, and fade in
        const cardDisplay = document.querySelector('.slum-report-card');
        cardDisplay.style.opacity = '0.3';
        cardDisplay.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
          reportTitle.textContent = data.title;
          reportFamilies.textContent = data.families;
          reportPads.textContent = data.pads;
          reportWorkshops.textContent = data.workshops;
          
          cardDisplay.style.opacity = '1';
          cardDisplay.style.transform = 'none';
        }, 200);
      }
    });
  });


  /* --------------------------------------------------------------------------
     4.2 Volunteer Skill Matcher Dashboard Controller
     -------------------------------------------------------------------------- */
  const timeTabBtns = document.querySelectorAll('.time-tab-btn');
  const matcherResult = document.getElementById('matcherResult');
  const matchBadge = document.getElementById('matchBadge');
  const matchTitle = document.getElementById('matchTitle');
  const matchDesc = document.getElementById('matchDesc');
  const matchBullets = document.getElementById('matchBullets');
  const matchCtaBtn = document.getElementById('matchCtaBtn');

  const matcherDataMap = {
    'hours-year': {
      badge: 'One-time Volunteer Opportunity',
      title: 'Community Drive Champion',
      desc: 'Become a boots-on-the-ground volunteer for our monthly sanitary pad distribution drives or help organize localized fundraising campaigns. Perfect for busy professionals who want to make a targeted, immediate difference in their local community.',
      bullets: [
        '<div><span>✓</span> Direct community engagement</div>',
        '<div><span>✓</span> Help distribute biodegradable kits</div>',
        '<div><span>✓</span> Ideal for groups and corporate days</div>'
      ],
      ctaText: 'Apply as Drive Champion',
      interestVal: 'pad-distribution'
    },
    'hours-month': {
      badge: 'Program Volunteer / Mentor Opportunity',
      title: 'One-to-One Mentor & Skilling Guide',
      desc: 'Invest a few hours each month to guide under-served girls who are the first in their family to target a four-year college. Conduct virtual tutoring in digital literacy, career preparedness, or lead science hygiene workshops.',
      bullets: [
        '<div><span>✓</span> Direct individual mentorship</div>',
        '<div><span>✓</span> Guide girls through academic transitions</div>',
        '<div><span>✓</span> Flexible virtual check-ins</div>'
      ],
      ctaText: 'Apply as Student Mentor',
      interestVal: 'mentor'
    },
    'hours-week': {
      badge: 'Core Stakeholder Opportunity',
      title: 'Leadership Team & Regional Investor',
      desc: 'Step forward as a core leader, local board member, or financial investor. Work alongside dedicated professionals in each region raising funds, securing local corporate sponsors, organizing chapter outreach, and coordinating operations across the state.',
      bullets: [
        '<div><span>✓</span> Strategic direction & operations</div>',
        '<div><span>✓</span> Local fundraising & brand building</div>',
        '<div><span>✓</span> Invest several hours per week</div>'
      ],
      ctaText: 'Apply for Leadership Board',
      interestVal: 'leadership'
    }
  };

  timeTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      timeTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const timeKey = btn.getAttribute('data-time');
      const data = matcherDataMap[timeKey];

      if (data) {
        // Slide out animation
        matcherResult.style.opacity = '0.3';
        matcherResult.style.transform = 'translateY(15px)';

        setTimeout(() => {
          // Update details
          matchBadge.textContent = data.badge;
          matchTitle.textContent = data.title;
          matchDesc.textContent = data.desc;
          matchBullets.innerHTML = data.bullets.join('');
          matchCtaBtn.textContent = data.ctaText;
          
          // Sync select field in modal
          const selectField = document.getElementById('volunteerInterest');
          selectField.value = data.interestVal;

          // Slide in animation
          matcherResult.style.opacity = '1';
          matcherResult.style.transform = 'translateY(0)';
        }, 200);
      }
    });
  });


  /* --------------------------------------------------------------------------
     5. Real-Time Donation Impact Calculator & Heart Bursts
     -------------------------------------------------------------------------- */
  const donationSlider = document.getElementById('donationSlider');
  const amountDisplay = document.getElementById('amountDisplay');
  const padsCountDisplay = document.getElementById('padsCount');
  const girlsCountDisplay = document.getElementById('girlsCount');
  const weeksCountDisplay = document.getElementById('weeksCount');
  const heartSparksContainer = document.getElementById('heartSparks');

  // Trigger burst of flying hearts when slider changes
  function createHeartSpark() {
    const heart = document.createElement('div');
    heart.classList.add('spark-heart');
    heart.textContent = ['🌸', '💖', '✨', '👑', '❤️'][Math.floor(Math.random() * 5)];
    
    // Position randomly centered on the metric display
    const x = 50 + (Math.random() * 100 - 50);
    const y = 80 + (Math.random() * 100 - 50);
    heart.style.left = `${x}%`;
    heart.style.top = `${y}%`;
    
    // Set travel vectors (dx, dy) for CSS animation
    const dx = `${Math.random() * 200 - 100}px`;
    const dy = `-${100 + Math.random() * 150}px`;
    heart.style.setProperty('--dx', dx);
    heart.style.setProperty('--dy', dy);
    
    heartSparksContainer.appendChild(heart);
    
    // Remove element after animation ends
    setTimeout(() => {
      heart.remove();
    }, 1200);
  }

  function updateCalculator() {
    const donationVal = parseInt(donationSlider.value, 10);
    
    // Format slider amount
    amountDisplay.textContent = `₹ ${donationVal.toLocaleString('en-IN')}`;
    
    // Math logic based on current NGO statistics (Approx ₹10 per pad distributed)
    const pads = donationVal / 10;
    // 1 girl needs about 12 pads a month, or ~144 pads a year for dignity supply
    const girls = Math.floor(pads / 12);
    // School weeks preserved (approx. 5 weeks of school saved per girl from skipping)
    const weeks = Math.floor(girls * 5);
    
    // Animated counting logic for results to feel incredibly organic and smooth
    animateResultCounter(padsCountDisplay, pads);
    animateResultCounter(girlsCountDisplay, girls);
    animateResultCounter(weeksCountDisplay, weeks);

    // Fire sparks
    if (Math.random() > 0.4) {
      createHeartSpark();
    }
  }

  // Smooth local animation helper for calculator values
  function animateResultCounter(displayElement, targetValue) {
    const currentVal = parseInt(displayElement.textContent.replace(/,/g, ''), 10) || 0;
    if (currentVal === targetValue) return;

    const diff = targetValue - currentVal;
    // Animate in 8 fast frames
    let frame = 0;
    const totalFrames = 8;
    
    function tick() {
      frame++;
      const val = Math.floor(currentVal + (diff * (frame / totalFrames)));
      displayElement.textContent = val.toLocaleString();
      
      if (frame < totalFrames) {
        requestAnimationFrame(tick);
      } else {
        displayElement.textContent = targetValue.toLocaleString();
      }
    }
    requestAnimationFrame(tick);
  }

  // Listeners for Slider inputs (support both standard click-drag and mobile touch)
  donationSlider.addEventListener('input', updateCalculator);
  donationSlider.addEventListener('change', updateCalculator);

  // Initialize Calculator on start
  updateCalculator();


  /* --------------------------------------------------------------------------
     6. Success Stories (Testimonial Carousel)
     -------------------------------------------------------------------------- */
  const carouselWrapper = document.getElementById('carouselWrapper');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const dotsContainer = document.getElementById('carouselDots');
  
  let currentSlideIndex = 0;
  let autoSlideTimer;

  // Render slides offset positions
  function showSlide(index) {
    // Wrap index borders
    if (index >= slides.length) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = index;
    
    // Translate slides
    carouselWrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    
    // Update classes for fade effects
    slides.forEach((slide, i) => {
      if (i === currentSlideIndex) {
        slide.classList.add('active-slide');
      } else {
        slide.classList.remove('active-slide');
      }
    });

    // Update Dots indicator
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Reset timer
    resetAutoSlide();
  }

  // Event handlers
  nextBtn.addEventListener('click', () => showSlide(currentSlideIndex + 1));
  prevBtn.addEventListener('click', () => showSlide(currentSlideIndex - 1));
  
  // Wire dynamic dots
  const dots = dotsContainer.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  // Automated sliding rotation
  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      showSlide(currentSlideIndex + 1);
    }, 6000); // Shift slide every 6 seconds
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  // Initial trigger
  startAutoSlide();


  /* --------------------------------------------------------------------------
     7. Volunteer Registration Modal & Validation
     -------------------------------------------------------------------------- */
  const volunteerModal = document.getElementById('volunteerModal');
  const openModalBtn = document.getElementById('openVolunteerModalBtn');
  const mobileVolBtn = document.getElementById('mobileVolunteerBtn');
  const triggerBtns = document.querySelectorAll('.trigger-volunteer-modal');
  const closeModalBtn = document.getElementById('closeVolunteerModalBtn');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const volunteerForm = document.getElementById('volunteerForm');
  const modalSuccessState = document.getElementById('modalSuccessState');
  
  // Accessibility Focus Trap Helpers
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let firstFocusableElement;
  let lastFocusableElement;

  function openModal() {
    volunteerModal.classList.add('open');
    volunteerModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock screen scroll

    // Focus on first input
    const focusable = volunteerModal.querySelectorAll(focusableElements);
    if (focusable.length) {
      firstFocusableElement = focusable[0];
      lastFocusableElement = focusable[focusable.length - 1];
      firstFocusableElement.focus();
    }
    
    // Add escape key listener
    document.addEventListener('keydown', handleKeyDown);
  }

  function closeModal() {
    volunteerModal.classList.remove('open');
    volunteerModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock scroll
    
    // Clean fields and state after close transition finished
    setTimeout(() => {
      volunteerForm.reset();
      volunteerForm.classList.remove('hidden');
      modalSuccessState.classList.remove('active');
    }, 300);

    document.removeEventListener('keydown', handleKeyDown);
  }

  // Handle escape key and tab-focus cycles
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
    
    // Tab trap
    if (e.key === 'Tab') {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  }

  // Wire buttons
  openModalBtn.addEventListener('click', openModal);
  if (mobileVolBtn) mobileVolBtn.addEventListener('click', () => {
    toggleMobileMenu();
    openModal();
  });
  triggerBtns.forEach(btn => btn.addEventListener('click', openModal));

  closeModalBtn.addEventListener('click', closeModal);
  closeSuccessBtn.addEventListener('click', closeModal);
  
  // Click outside card to close
  volunteerModal.addEventListener('click', (e) => {
    if (e.target === volunteerModal) {
      closeModal();
    }
  });

  // Modal Form submission
  volunteerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate API Network call with a premium transition
    const submitBtn = volunteerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Registering Champion...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Toggle states
      volunteerForm.classList.add('hidden');
      modalSuccessState.classList.add('active');
      
      // Trigger dynamic spark effect inside success state
      for (let i = 0; i < 15; i++) {
        setTimeout(createHeartSpark, i * 80);
      }
    }, 1200); // 1.2s delay simulation
  });


  /* --------------------------------------------------------------------------
     8. Newsletter Subscription Handler
     -------------------------------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('.newsletter-input');
      const email = emailInput.value.trim();
      
      if (email) {
        const submitBtn = newsletterForm.querySelector('.newsletter-submit-btn');
        submitBtn.textContent = '✓';
        emailInput.value = '';
        emailInput.placeholder = 'Subscribed Successfully! ✨';
        emailInput.disabled = true;
        
        setTimeout(() => {
          submitBtn.textContent = '→';
          emailInput.placeholder = 'Your Email Address';
          emailInput.disabled = false;
        }, 4000);
      }
    });
  }

  /* --------------------------------------------------------------------------
     9. Interactive "Volunteer Certificate" Real-time Previewer
     -------------------------------------------------------------------------- */
  const certInput = document.getElementById('certNameInput');
  const certOutput = document.getElementById('certNameOutput');
  const printCertBtn = document.getElementById('printCertBtn');

  if (certInput && certOutput) {
    certInput.addEventListener('input', (e) => {
      const nameVal = e.target.value.trim();
      
      // Mirror value in real-time, default to placeholder if empty
      certOutput.textContent = nameVal || 'Your Name Here';
      
      // Micro-animation scale-pop effect on mirror container for visual feedback
      certOutput.style.transform = 'scale(1.02)';
      setTimeout(() => {
        certOutput.style.transform = 'none';
      }, 100);
    });
  }

  if (printCertBtn) {
    printCertBtn.addEventListener('click', () => {
      window.print();
    });
  }


  /* --------------------------------------------------------------------------
     10. Longitudinal "7-Year Success Journey" Timeline Progress
     -------------------------------------------------------------------------- */
  const timelineProgress = document.getElementById('timelineProgress');
  const timelineSection = document.getElementById('timeline');

  if (timelineProgress && timelineSection) {
    window.addEventListener('scroll', () => {
      const rect = timelineSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if timeline section is visible in viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        // Calculate progress percentage inside the timeline container
        // Start filling when top of timeline is at 60% of viewport height
        const startOffset = viewportHeight * 0.6;
        const totalTravel = rect.height;
        const scrolled = startOffset - rect.top;
        let percent = (scrolled / totalTravel) * 100;
        percent = Math.max(0, Math.min(percent, 100)); // Clamp between 0% and 100%
        
        timelineProgress.style.height = `${percent}%`;
      }
    });
  }


  /* --------------------------------------------------------------------------
     11. Interactive "Budget Transparency" Donut Chart
     -------------------------------------------------------------------------- */
  const donutSegments = document.querySelectorAll('.donut-segment');
  const legendCards = document.querySelectorAll('.legend-card');
  const donutPercent = document.getElementById('donutPercent');
  const donutCategory = document.getElementById('donutCategory');
  const spendingDesc = document.getElementById('spendingDesc');

  const budgetInfo = {
    slum: {
      percent: '75%',
      category: 'Slum Care',
      class: 'segment-slum',
      desc: 'Used directly to source and manufacture biodegradable sanitary napkins, compile family dignity kits, and manage monthly distribution logistics inside adopted slum hubs.'
    },
    seminars: {
      percent: '15%',
      category: 'Seminars',
      class: 'segment-seminars',
      desc: 'Directly funds informational charts, models, and reproductive education curriculums for schoolgirls and Anganwadi community facilitators.'
    },
    skilling: {
      percent: '10%',
      category: 'Skilling',
      class: 'segment-skilling',
      desc: 'Secures local skilling lab rentals, digital literacy tools, and maintains mentorship programs to guide girls into higher education.'
    }
  };

  // Sync Donut segment class with budgetInfo keys
  function getSegmentKey(segment) {
    if (segment.classList.contains('segment-slum')) return 'slum';
    if (segment.classList.contains('segment-seminars')) return 'seminars';
    if (segment.classList.contains('segment-skilling')) return 'skilling';
    return 'slum';
  }

  function getLegendKey(card) {
    const cat = card.getAttribute('data-cat');
    if (cat === 'Slum Care') return 'slum';
    if (cat === 'Seminars') return 'seminars';
    if (cat === 'Skilling') return 'skilling';
    return 'slum';
  }

  function updateActiveBudgetState(key) {
    const data = budgetInfo[key];
    if (!data) return;

    // 1. Update text displays
    donutPercent.textContent = data.percent;
    donutCategory.textContent = data.category;
    spendingDesc.textContent = data.desc;

    // 2. Sync donut segments
    donutSegments.forEach(seg => {
      if (seg.classList.contains(data.class)) {
        seg.classList.add('active-segment');
      } else {
        seg.classList.remove('active-segment');
      }
    });

    // 3. Sync legend cards
    legendCards.forEach(card => {
      const cardKey = getLegendKey(card);
      if (cardKey === key) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // Bind Donut segment interactions
  donutSegments.forEach(segment => {
    segment.addEventListener('mouseenter', () => {
      const key = getSegmentKey(segment);
      updateActiveBudgetState(key);
    });
    segment.addEventListener('click', () => {
      const key = getSegmentKey(segment);
      updateActiveBudgetState(key);
    });
  });

  // Bind Legend card interactions
  legendCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const key = getLegendKey(card);
      updateActiveBudgetState(key);
    });
    card.addEventListener('click', () => {
      const key = getLegendKey(card);
      updateActiveBudgetState(key);
    });
  });

});
