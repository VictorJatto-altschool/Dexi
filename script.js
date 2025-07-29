// Theme Toggle
const themeToggle = document.getElementById("theme-toggle")
const body = document.body

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  body.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)

  // Update icon
  const icon = themeToggle.querySelector("i")
  icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon"
})

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "light"
body.setAttribute("data-theme", savedTheme)
const iconToggle = themeToggle.querySelector("i")
iconToggle.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon"

// Mobile Navigation
const hamburger = document.getElementById("hamburger")
const navMenuElement = document.getElementById("nav-menu")

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navMenuElement.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active")
    navMenuElement.classList.remove("active")
  })
})

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Navbar Scroll Effect
const navbar = document.getElementById("navbar")
let lastScrollTop = 0

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  if (scrollTop > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)"
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)"
    navbar.style.boxShadow = "none"
  }

  // Update for dark theme
  if (body.getAttribute("data-theme") === "dark") {
    if (scrollTop > 100) {
      navbar.style.background = "rgba(17, 24, 39, 0.98)"
    } else {
      navbar.style.background = "rgba(17, 24, 39, 0.95)"
    }
  }

  lastScrollTop = scrollTop
})

// Scroll to Top Button
const scrollToTopBtn = document.getElementById("scroll-to-top")

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add("visible")
  } else {
    scrollToTopBtn.classList.remove("visible")
  }
})

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})

// Rating Modal
const leaveRatingBtn = document.getElementById("leave-rating-btn")
const ratingModal = document.getElementById("rating-modal")
const modalClose = document.getElementById("modal-close")
const starRatingElement = document.getElementById("star-rating")
const submitRating = document.getElementById("submit-rating")

let selectedRating = 0

leaveRatingBtn.addEventListener("click", () => {
  ratingModal.classList.add("active")
  document.body.style.overflow = "hidden"
})

modalClose.addEventListener("click", closeModal)
ratingModal.addEventListener("click", (e) => {
  if (e.target === ratingModal) {
    closeModal()
  }
})

function closeModal() {
  ratingModal.classList.remove("active")
  document.body.style.overflow = "auto"
  resetModal()
}

function resetModal() {
  selectedRating = 0
  document.querySelectorAll(".star-rating i").forEach((star) => {
    star.classList.remove("active")
  })
  document.getElementById("comment").value = ""
  document.getElementById("reviewer-name").value = ""
  document.getElementById("user-type").value = ""
}

// Star Rating Interaction
document.querySelectorAll(".star-rating i").forEach((star, index) => {
  star.addEventListener("click", () => {
    selectedRating = index + 1
    updateStars()
  })

  star.addEventListener("mouseenter", () => {
    highlightStars(index + 1)
  })
})

starRatingElement.addEventListener("mouseleave", () => {
  updateStars()
})

function updateStars() {
  document.querySelectorAll(".star-rating i").forEach((star, index) => {
    if (index < selectedRating) {
      star.classList.add("active")
    } else {
      star.classList.remove("active")
    }
  })
}

function highlightStars(rating) {
  document.querySelectorAll(".star-rating i").forEach((star, index) => {
    if (index < rating) {
      star.classList.add("active")
    } else {
      star.classList.remove("active")
    }
  })
}

// Submit Rating
submitRating.addEventListener("click", () => {
  const comment = document.getElementById("comment").value
  const reviewerName = document.getElementById("reviewer-name").value
  const userType = document.getElementById("user-type").value

  if (selectedRating === 0) {
    alert("Please select a rating")
    return
  }

  if (!reviewerName.trim()) {
    alert("Please enter your name")
    return
  }

  if (!userType) {
    alert("Please select your profession")
    return
  }

  // Simulate submission
  submitRating.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'
  submitRating.disabled = true

  setTimeout(() => {
    // Add the new review to the live reviews
    addNewReview({
      name: reviewerName,
      type: userType,
      rating: selectedRating,
      comment: comment || "Great concept! Looking forward to the launch.",
      date: "Just now",
    })

    // Update live score
    updateLiveScore()

    alert("Thank you for your feedback! Your review has been added.")
    closeModal()
    submitRating.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback'
    submitRating.disabled = false
  }, 2000)
})

// Enhanced Email Signup with Waitlist Functionality
const emailSignup = document.getElementById("email-signup")
emailSignup.addEventListener("submit", async (e) => {
  e.preventDefault()

  const email = e.target.querySelector('input[type="email"]').value
  const userType = e.target.querySelector(".user-type-select").value
  const loadingOverlay = document.getElementById("loading-overlay")

  // Validation
  if (!email || !isValidEmail(email)) {
    showFormError(e.target, "Please enter a valid email address")
    return
  }

  if (!userType) {
    showFormError(e.target, "Please select your profession")
    return
  }

  // Clear any previous errors
  clearFormErrors(e.target)

  // Show loading overlay
  loadingOverlay.classList.add("active")
  document.body.style.overflow = "hidden"

  try {
    // Create FormData for server action
    const formData = new FormData()
    formData.append("email", email)
    formData.append("userType", userType)

    // Call server action (in a real implementation, this would be handled by your backend)
    const result = await submitToWaitlistClient(formData)

    if (result.success) {
      // Update signup counter
      const counter = document.getElementById("signup-counter")
      const currentCount = Number.parseInt(counter.textContent.replace(",", ""))
      const newCount = currentCount + 1
      counter.textContent = newCount.toLocaleString()

      // Update user position in waitlist
      document.getElementById("user-position").textContent = newCount.toLocaleString()

      // Hide loading overlay
      loadingOverlay.classList.remove("active")
      document.body.style.overflow = "auto"

      // Show success modal
      showWaitlistSuccessModal()

      // Reset form
      e.target.reset()

      // Track successful signup
      trackWaitlistSignup({
        email: email,
        userType: userType,
        timestamp: new Date().toISOString(),
        source: "landing_page",
      })
    } else {
      throw new Error(result.error || "Submission failed")
    }
  } catch (error) {
    console.error("Waitlist signup error:", error)

    // Hide loading overlay
    loadingOverlay.classList.remove("active")
    document.body.style.overflow = "auto"

    // Show error message
    showFormError(e.target, error.message || "Something went wrong. Please try again.")
  }
})

// Client-side function to simulate server action (replace with actual server integration)
async function submitToWaitlistClient(formData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const email = formData.get("email")
  const userType = formData.get("userType")

  // In a real implementation, this would call your backend API
  // For now, we'll simulate the email sending process

  try {
    // Simulate sending email to Victor
    console.log("Sending notification email to jattovictor32@gmail.com:", {
      email: email,
      userType: userType,
      timestamp: new Date().toISOString(),
      source: "landing_page",
    })

    // Simulate sending welcome email to user
    console.log("Sending welcome email to:", email)

    // In production, integrate with email service like:
    // - EmailJS (client-side)
    // - Your backend API endpoint
    // - Serverless function (Vercel, Netlify)

    return {
      success: true,
      message: "Successfully joined the waitlist!",
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to process your request. Please try again.",
    }
  }
}

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Show form error
function showFormError(form, message) {
  const formGroup = form.querySelector(".form-group")
  formGroup.classList.add("error")

  let errorElement = formGroup.querySelector(".form-error")
  if (!errorElement) {
    errorElement = document.createElement("div")
    errorElement.className = "form-error"
    formGroup.appendChild(errorElement)
  }

  errorElement.textContent = message

  // Remove error after 5 seconds
  setTimeout(() => {
    clearFormErrors(form)
  }, 5000)
}

// Clear form errors
function clearFormErrors(form) {
  const formGroup = form.querySelector(".form-group")
  formGroup.classList.remove("error")

  const errorElement = formGroup.querySelector(".form-error")
  if (errorElement) {
    errorElement.style.display = "none"
  }
}

// Send waitlist notification (enhanced version)
async function sendWaitlistNotification(data) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Enhanced email data for Victor
  const adminEmailData = {
    to: "jattovictor32@gmail.com",
    subject: "🚀 New Dexi Waitlist Signup",
    html: `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">New Waitlist Signup</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Someone just joined the Dexi waitlist!</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-top: 0; font-size: 20px; font-weight: 700;">User Details</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0; color: #374151;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 10px 0; color: #374151;"><strong>User Type:</strong> ${data.userType}</p>
            <p style="margin: 10px 0; color: #374151;"><strong>Signup Date:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
            <p style="margin: 10px 0; color: #374151;"><strong>Source:</strong> ${data.source}</p>
            <p style="margin: 10px 0; color: #374151;"><strong>Referrer:</strong> ${data.referrer || "Direct"}</p>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; font-size: 16px; font-weight: 600;">Recommended Next Steps</h3>
            <ul style="color: #6b7280; margin: 10px 0; padding-left: 20px;">
              <li>Add to your email marketing list</li>
              <li>Send personalized welcome email</li>
              <li>Update waitlist counter on website</li>
              <li>Consider reaching out for user feedback</li>
              <li>Add to appropriate user segment based on type</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 14px;">
          <p>This email was sent automatically from the Dexi landing page.</p>
          <p>Total waitlist signups are growing! 🚀</p>
        </div>
      </div>
    `,
  }

  // Enhanced welcome email for user
  const userEmailData = {
    to: data.email,
    subject: "Welcome to the Dexi Waitlist! 🚀",
    html: `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Welcome to Dexi! 🎉</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 16px;">You're now part of our exclusive waitlist</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-top: 0; font-size: 22px; font-weight: 700;">What happens next?</h2>
          
          <div style="margin: 30px 0;">
            <div style="margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 10px; border-left: 4px solid #6366f1;">
              <h3 style="color: #1f2937; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">🚀 Early Access Invitation</h3>
              <p style="color: #6b7280; margin: 0; line-height: 1.5;">You'll be among the first to access Dexi when we launch our beta.</p>
            </div>
            
            <div style="margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 10px; border-left: 4px solid #10b981;">
              <h3 style="color: #1f2937; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">📧 Exclusive Updates</h3>
              <p style="color: #6b7280; margin: 0; line-height: 1.5;">Get behind-the-scenes updates on our development progress and new features.</p>
            </div>
            
            <div style="margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 10px; border-left: 4px solid #f59e0b;">
              <h3 style="color: #1f2937; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">🎁 Special Perks</h3>
              <p style="color: #6b7280; margin: 0; line-height: 1.5;">Enjoy exclusive launch bonuses and premium features as an early supporter.</p>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0;">
            <h3 style="color: white; margin: 0 0 10px 0; font-size: 18px; font-weight: 700;">Stay Connected</h3>
            <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px 0;">Follow our journey and connect with other creative professionals</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Questions? Reply to this email - we'd love to hear from you!</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
          <p style="margin: 5px 0;">© 2024 Dexi. All rights reserved.</p>
          <p style="margin: 5px 0;">You're receiving this because you signed up for our waitlist.</p>
        </div>
      </div>
    `,
  }

  console.log("Admin email data:", adminEmailData)
  console.log("User email data:", userEmailData)

  return { success: true, adminEmail: adminEmailData, userEmail: userEmailData }
}

// Show waitlist success modal
function showWaitlistSuccessModal() {
  const modal = document.getElementById("waitlist-success-modal")
  modal.classList.add("active")
  document.body.style.overflow = "hidden"

  // Add confetti effect (optional)
  createConfetti()
}

// Close waitlist success modal
const waitlistModalClose = document.getElementById("waitlist-modal-close")
waitlistModalClose.addEventListener("click", () => {
  const modal = document.getElementById("waitlist-success-modal")
  modal.classList.remove("active")
  document.body.style.overflow = "auto"
})

// Close modal when clicking outside
document.getElementById("waitlist-success-modal").addEventListener("click", (e) => {
  if (e.target.id === "waitlist-success-modal") {
    const modal = document.getElementById("waitlist-success-modal")
    modal.classList.remove("active")
    document.body.style.overflow = "auto"
  }
})

// Social sharing functions
function shareOnTwitter() {
  const text = "I just joined the waitlist for Dexi - the social and freelance platform for creative professionals! Built by @jattovictor32 🚀"
  const url = window.location.href
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  window.open(twitterUrl, "_blank", "width=600,height=400")
}

function shareOnLinkedIn() {
  const url = window.location.href
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  window.open(linkedinUrl, "_blank", "width=600,height=400")
}

function copyReferralLink() {
  const url = window.location.href
  navigator.clipboard
    .writeText(url)
    .then(() => {
      const copyBtn = document.querySelector(".share-btn.copy")
      const originalText = copyBtn.innerHTML
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!'
      copyBtn.style.background = "var(--accent-color)"
      copyBtn.style.color = "white"

      setTimeout(() => {
        copyBtn.innerHTML = originalText
        copyBtn.style.background = ""
        copyBtn.style.color = ""
      }, 2000)
    })
    .catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)

      alert("Link copied to clipboard!")
    })
}

// Track waitlist signup (analytics)
function trackWaitlistSignup(data) {
  // Integrate with analytics services like:
  // - Google Analytics
  // - Mixpanel
  // - Amplitude
  // - PostHog

  console.log("Tracking waitlist signup:", data)

  // Example Google Analytics event
  // Declare gtag variable here if needed
  const gtag = window.gtag // Assuming gtag is available globally
  if (typeof gtag !== "undefined") {
    gtag("event", "waitlist_signup", {
      event_category: "engagement",
      event_label: data.userType,
      value: 1,
    })
  }
}

// Confetti effect for success modal
function createConfetti() {
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"]
  const confettiCount = 50

  for (let i = 0; i < confettiCount; i++) {
    createConfettiPiece(colors[Math.floor(Math.random() * colors.length)])
  }
}

function createConfettiPiece(color) {
  const confetti = document.createElement("div")
  confetti.style.position = "fixed"
  confetti.style.width = "10px"
  confetti.style.height = "10px"
  confetti.style.backgroundColor = color
  confetti.style.left = Math.random() * 100 + "vw"
  confetti.style.top = "-10px"
  confetti.style.zIndex = "9999"
  confetti.style.pointerEvents = "none"
  confetti.style.borderRadius = "50%"

  document.body.appendChild(confetti)

  const animation = confetti.animate(
    [
      { transform: "translateY(0) rotate(0deg)", opacity: 1 },
      { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 },
    ],
    {
      duration: Math.random() * 3000 + 2000,
      easing: "cubic-bezier(0.5, 0, 0.5, 1)",
    },
  )

  animation.onfinish = () => {
    confetti.remove()
  }
}

// Enhanced nav CTA buttons to trigger waitlist
document.querySelectorAll(".nav-cta, #hero-cta").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementById("contact").scrollIntoView({
      behavior: "smooth",
      block: "start",
    })

    // Focus on email input after scroll
    setTimeout(() => {
      const emailInput = document.querySelector('#email-signup input[type="email"]')
      if (emailInput) {
        emailInput.focus()
      }
    }, 1000)
  })
})

// Privacy and security measures
function sanitizeInput(input) {
  return input.trim().replace(/[<>]/g, "")
}

// Rate limiting for form submissions
let lastSubmissionTime = 0
const SUBMISSION_COOLDOWN = 5000 // 5 seconds

function canSubmitForm() {
  const now = Date.now()
  if (now - lastSubmissionTime < SUBMISSION_COOLDOWN) {
    return false
  }
  lastSubmissionTime = now
  return true
}

// Update the email signup handler to include rate limiting
const originalEmailHandler = emailSignup.onsubmit
emailSignup.addEventListener("submit", (e) => {
  if (!canSubmitForm()) {
    e.preventDefault()
    showFormError(e.target, "Please wait a moment before submitting again")
    return
  }
})

// Dynamic Reviews System
const reviewsData = [
  {
    name: "Marcus Johnson",
    type: "freelancer",
    avatar: "M",
    rating: 5,
    comment:
      "Finally, a platform that gets it! As a freelancer, building trust has always been my biggest challenge. Dexi's social approach is genius.",
    date: "2 days ago",
    helpful: 12,
  },
  {
    name: "Anna Rodriguez",
    type: "creator",
    avatar: "A",
    rating: 5,
    comment:
      "The live streaming feature is a game-changer. I can showcase my design process in real-time and connect with potential clients instantly.",
    date: "1 week ago",
    helpful: 8,
  },
  {
    name: "David Kim",
    type: "marketer",
    avatar: "D",
    rating: 5,
    comment:
      "Love how it syncs with my GitHub and Behance. My portfolio is always up-to-date, and clients can see my real work history.",
    date: "2 weeks ago",
    helpful: 15,
  },
  {
    name: "Sarah Chen",
    type: "creator",
    avatar: "S",
    rating: 4,
    comment:
      "Great concept! The multi-platform integration is exactly what I've been looking for. Can't wait for the beta launch.",
    date: "3 days ago",
    helpful: 6,
  },
  {
    name: "Mike Thompson",
    type: "freelancer",
    avatar: "M",
    rating: 5,
    comment:
      "This could revolutionize how freelancers build their reputation. The social discovery aspect is brilliant!",
    date: "5 days ago",
    helpful: 9,
  },
  {
    name: "Lisa Wang",
    type: "marketer",
    avatar: "L",
    rating: 5,
    comment:
      "As a digital marketer, I love the idea of building my brand while showcasing my work. This is the future of professional networking.",
    date: "1 week ago",
    helpful: 11,
  },
]

let currentReviewIndex = 3 // Show first 3 reviews initially

function createReviewCard(review) {
  const avatarColors = {
    creator: "var(--gradient-creator)",
    freelancer: "var(--gradient-freelancer)",
    marketer: "var(--gradient-marketer)",
  }

  return `
    <div class="comment-card">
      <div class="comment-header">
        <div class="commenter-info">
          <div class="commenter-avatar" style="background: ${avatarColors[review.type]}">${review.avatar}</div>
          <div>
            <h4>${review.name}</h4>
            <span class="commenter-type ${review.type}">${review.type.charAt(0).toUpperCase() + review.type.slice(1)}</span>
          </div>
        </div>
        <div>
          <div class="comment-rating">${"⭐".repeat(review.rating)}</div>
          <span class="comment-date">${review.date}</span>
        </div>
      </div>
      <p class="comment-text">${review.comment}</p>
      <div class="comment-actions">
        <button class="helpful-btn" onclick="markHelpful(this)">
          <i class="fas fa-thumbs-up"></i>
          Helpful (${review.helpful})
        </button>
      </div>
    </div>
  `
}

function loadInitialReviews() {
  const reviewsContainer = document.getElementById("reviews-container")
  const commentsList = document.getElementById("comments-list")

  // Load reviews for live ratings section
  if (reviewsContainer) {
    reviewsContainer.innerHTML = reviewsData.slice(0, 3).map(createReviewCard).join("")
  }

  // Load reviews for dynamic ratings section
  if (commentsList) {
    commentsList.innerHTML = reviewsData.slice(0, currentReviewIndex).map(createReviewCard).join("")
  }
}

function loadMoreReviews() {
  const commentsList = document.getElementById("comments-list")
  const loadMoreBtn = document.getElementById("load-more-comments")

  if (currentReviewIndex >= reviewsData.length) {
    loadMoreBtn.style.display = "none"
    return
  }

  loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'

  setTimeout(() => {
    const nextReviews = reviewsData.slice(currentReviewIndex, currentReviewIndex + 2)
    nextReviews.forEach((review) => {
      commentsList.innerHTML += createReviewCard(review)
    })

    currentReviewIndex += 2

    if (currentReviewIndex >= reviewsData.length) {
      loadMoreBtn.style.display = "none"
    } else {
      loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Reviews'
    }
  }, 1000)
}

// Load more reviews button
const loadMoreBtnElement = document.getElementById("load-more-comments")
if (loadMoreBtnElement) {
  loadMoreBtnElement.addEventListener("click", loadMoreReviews)
}

// Filter reviews by type
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")

    const filter = btn.dataset.filter
    const commentsList = document.getElementById("comments-list")

    let filteredReviews = reviewsData
    if (filter !== "all") {
      filteredReviews = reviewsData.filter((review) => review.type === filter)
    }

    commentsList.innerHTML = filteredReviews.slice(0, 3).map(createReviewCard).join("")
    currentReviewIndex = 3

    const loadMoreBtn = document.getElementById("load-more-comments")
    if (filteredReviews.length > 3) {
      loadMoreBtn.style.display = "block"
    } else {
      loadMoreBtn.style.display = "none"
    }
  })
})

// Add new review function
function addNewReview(reviewData) {
  const newReview = {
    name: reviewData.name,
    type: reviewData.type,
    avatar: reviewData.name.charAt(0).toUpperCase(),
    rating: reviewData.rating,
    comment: reviewData.comment,
    date: reviewData.date,
    helpful: 0,
  }

  reviewsData.unshift(newReview)

  // Update both review sections
  const reviewsContainer = document.getElementById("reviews-container")
  const commentsList = document.getElementById("comments-list")

  if (reviewsContainer) {
    reviewsContainer.innerHTML = reviewsData.slice(0, 3).map(createReviewCard).join("")
  }

  if (commentsList) {
    commentsList.innerHTML = reviewsData.slice(0, currentReviewIndex).map(createReviewCard).join("")
  }
}

// Update live score
function updateLiveScore() {
  const scoreElement = document.getElementById("live-score")
  const reviewCountElement = document.getElementById("review-count")

  if (scoreElement && reviewCountElement) {
    const totalReviews = reviewsData.length
    const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = (totalRating / totalReviews).toFixed(1)

    scoreElement.textContent = averageRating
    reviewCountElement.textContent = totalReviews
  }
}

// Mark review as helpful
function markHelpful(button) {
  const currentCount = Number.parseInt(button.textContent.match(/\d+/)[0])
  const newCount = currentCount + 1
  button.innerHTML = `<i class="fas fa-thumbs-up"></i> Helpful (${newCount})`
  button.style.color = "var(--primary-color)"
  button.style.borderColor = "var(--primary-color)"
  button.disabled = true
}

// Live Activity Feed
const activityData = [
  { name: "Alex M.", action: "left a 5-star review", time: "2m ago" },
  { name: "Sarah K.", action: "joined early access", time: "5m ago" },
  { name: "Mike R.", action: "left a 4-star review", time: "8m ago" },
  { name: "Lisa C.", action: "joined early access", time: "12m ago" },
  { name: "David L.", action: "left a 5-star review", time: "15m ago" },
]

function createActivityItem(activity) {
  return `
    <div class="activity-item">
      <div class="activity-avatar">${activity.name.charAt(0)}</div>
      <div class="activity-text">${activity.name} ${activity.action}</div>
      <div class="activity-time">${activity.time}</div>
    </div>
  `
}

function loadLiveActivity() {
  const activityFeed = document.getElementById("activity-feed")
  if (activityFeed) {
    activityFeed.innerHTML = activityData.map(createActivityItem).join("")
  }
}

// Simulate live activity updates
function simulateLiveActivity() {
  const actions = ["left a 5-star review", "joined early access", "left a 4-star review"]
  const names = ["John D.", "Emma S.", "Chris P.", "Maya L.", "Tom W."]

  setInterval(() => {
    const randomName = names[Math.floor(Math.random() * names.length)]
    const randomAction = actions[Math.floor(Math.random() * actions.length)]

    const newActivity = {
      name: randomName,
      action: randomAction,
      time: "Just now",
    }

    activityData.unshift(newActivity)
    activityData.pop() // Keep only 5 items

    // Update activity feed
    loadLiveActivity()
  }, 30000) // Update every 30 seconds
}

// Community Button Interactions
document.querySelectorAll(".community-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const platform = btn.dataset.platform
    const messages = {
      whatsapp: "WhatsApp group link will be shared with early access members!",
      telegram: "Telegram channel link coming soon! You'll be notified.",
      discord: "Discord server is being set up. Stay tuned!",
    }

    alert(messages[platform] || "Community link will be available soon!")
  })
})

// Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
    }
  })
}, observerOptions)

// Add animation classes and observe elements
document.addEventListener("DOMContentLoaded", () => {
  // Load initial content
  loadInitialReviews()
  loadLiveActivity()
  simulateLiveActivity()

  // Fade in animations
  document
    .querySelectorAll(".section-header, .problem-card, .feature-card, .step-card, .comment-card, .roadmap-item")
    .forEach((el) => {
      el.classList.add("fade-in")
      observer.observe(el)
    })

  // Slide in animations
  document.querySelectorAll(".hero-text").forEach((el) => {
    el.classList.add("slide-in-left")
    observer.observe(el)
  })

  document.querySelectorAll(".hero-visual, .solution-visual").forEach((el) => {
    el.classList.add("slide-in-right")
    observer.observe(el)
  })

  // Scale in animations
  document.querySelectorAll(".mockup-container, .founder-card").forEach((el) => {
    el.classList.add("scale-in")
    observer.observe(el)
  })
})

// Add counter animation for stats
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  function updateCounter() {
    start += increment
    if (start < target) {
      element.textContent = Math.floor(start)
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = target
    }
  }

  updateCounter()
}

// Initialize counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = Number.parseInt(entry.target.textContent.replace(/[^\d]/g, ""))
      if (target > 0) {
        animateCounter(entry.target, target)
        counterObserver.unobserve(entry.target)
      }
    }
  })
})

document.querySelectorAll(".stat-number, .score").forEach((counter) => {
  counterObserver.observe(counter)
})

// Add parallax effect to hero background
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const hero = document.querySelector(".hero")
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`
  }
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})

// Add CSS for loading animation
const loadingStyles = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: '';
        width: 50px;
        height: 50px;
        border: 3px solid var(--border-color);
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
`

// Inject loading styles
const styleSheet = document.createElement("style")
styleSheet.textContent = loadingStyles
document.head.appendChild(styleSheet)

// Hero CTA button interaction
const heroCTA = document.getElementById("hero-cta")
if (heroCTA) {
  heroCTA.addEventListener("click", () => {
    document.getElementById("contact").scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  })
}

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
  let i = 0
  element.innerHTML = ""

  function type() {
    if (i < text.length) {
      if (text.charAt(i) === "<") {
        // Handle HTML tags
        const tagEnd = text.indexOf(">", i)
        if (tagEnd !== -1) {
          element.innerHTML += text.substring(i, tagEnd + 1)
          i = tagEnd + 1
        } else {
          element.innerHTML += text.charAt(i)
          i++
        }
      } else {
        element.innerHTML += text.charAt(i)
        i++
      }
      setTimeout(type, speed)
    }
  }

  type()
}

// Initialize typing effect when page loads
window.addEventListener("load", () => {
  const heroTitle = document.querySelector(".hero-title")
  if (heroTitle) {
    const originalText = heroTitle.innerHTML
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 50)
    }, 500)
  }
})

// Add floating animation variance
document.addEventListener("DOMContentLoaded", () => {
  const floatingCards = document.querySelectorAll(".floating-card")

  floatingCards.forEach((card, index) => {
    // Add random delay and duration for more natural movement
    const delay = Math.random() * 2
    const duration = 3 + Math.random() * 2

    card.style.animationDelay = `${delay}s`
    card.style.animationDuration = `${duration}s`
  })
})

// Real-time signup counter simulation
function simulateSignupGrowth() {
  const signupCounter = document.getElementById("signup-counter")
  if (signupCounter) {
    setInterval(() => {
      const currentCount = Number.parseInt(signupCounter.textContent.replace(",", ""))
      const increment = Math.random() < 0.3 ? 1 : 0 // 30% chance of increment
      if (increment) {
        signupCounter.textContent = (currentCount + 1).toLocaleString()
      }
    }, 45000) // Check every 45 seconds
  }
}

// Initialize signup growth simulation
document.addEventListener("DOMContentLoaded", () => {
  simulateSignupGrowth()
})

// Add smooth reveal animations for cards
const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }, index * 100)
      }
    })
  },
  { threshold: 0.1 },
)

// Observe all cards for staggered animation
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".feature-card, .problem-card, .step-card").forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = "all 0.6s ease"
    cardObserver.observe(card)
  })
})

// Co-founder CTA Functionality
const cofounderCTABtn = document.getElementById("cofounder-cta-btn")
const heroCofounderCTA = document.getElementById("hero-cofounder-cta")
const learnMoreCofounder = document.getElementById("learn-more-cofounder")

// Track co-founder CTA clicks
function trackCofounderClick(source) {
  console.log(`Co-founder CTA clicked from: ${source}`)

  // Google Analytics tracking
  const gtag = window.gtag // Assuming gtag is available globally
  if (typeof gtag !== "undefined") {
    gtag("event", "cofounder_cta_click", {
      event_category: "engagement",
      event_label: source,
      value: 1,
    })
  }

  // Additional analytics can be added here
  // Example: Mixpanel, Amplitude, etc.
}

// Add click tracking to co-founder CTAs
if (cofounderCTABtn) {
  cofounderCTABtn.addEventListener("click", () => {
    trackCofounderClick("main_section")
  })
}

if (heroCofounderCTA) {
  heroCofounderCTA.addEventListener("click", () => {
    trackCofounderClick("hero_section")
  })
}

// Co-founder Info Modal
const cofounderInfoModal = document.createElement("div")
cofounderInfoModal.id = "cofounder-info-modal"
cofounderInfoModal.className = "cofounder-info-modal"
cofounderInfoModal.innerHTML = `
  <div class="cofounder-info-content">
    <div class="cofounder-info-header">
      <h3>Join as Co-founder</h3>
      <p>Help build the future of creative work</p>
      <button class="cofounder-info-close" id="cofounder-info-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="cofounder-info-body">
      <div class="cofounder-requirements">
        <h4>What We're Looking For</h4>
        <div class="requirement-list">
          <div class="requirement-item">
            <div class="requirement-icon">
              <i class="fas fa-code"></i>
            </div>
            <div class="requirement-text">
              <h5>Technical Co-founder</h5>
              <p>Full-stack development experience, preferably with React, Node.js, and cloud platforms. Passion for building scalable products.</p>
            </div>
          </div>
          <div class="requirement-item">
            <div class="requirement-icon">
              <i class="fas fa-bullhorn"></i>
            </div>
            <div class="requirement-text">
              <h5>Marketing Co-founder</h5>
              <p>Growth marketing expertise, content creation skills, and experience building communities. Understanding of creator economy preferred.</p>
            </div>
          </div>
          <div class="requirement-item">
            <div class="requirement-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="requirement-text">
              <h5>Business Co-founder</h5>
              <p>Business development, partnerships, and fundraising experience. Strong network in the freelance or creator space is a plus.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="cofounder-cta-final">
        <h4>Ready to Join the Journey?</h4>
        <p>Apply now and let's discuss how we can build Dexi together.</p>
        <a href="https://tally.so/r/3jAJdJ" target="_blank" rel="noopener noreferrer" class="cofounder-primary-btn" onclick="trackCofounderClick('info_modal')">
          <i class="fas fa-handshake"></i>
          <span>Apply Now</span>
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    </div>
  </div>
`

document.body.appendChild(cofounderInfoModal)

// Learn More button functionality
if (learnMoreCofounder) {
  learnMoreCofounder.addEventListener("click", () => {
    cofounderInfoModal.classList.add("active")
    document.body.style.overflow = "hidden"
    trackCofounderClick("learn_more")
  })
}

// Close modal functionality
const cofounderInfoClose = document.getElementById("cofounder-info-close")
cofounderInfoClose.addEventListener("click", () => {
  cofounderInfoModal.classList.remove("active")
  document.body.style.overflow = "auto"
})

cofounderInfoModal.addEventListener("click", (e) => {
  if (e.target === cofounderInfoModal) {
    cofounderInfoModal.classList.remove("active")
    document.body.style.overflow = "auto"
  }
})

// Smooth scroll to co-founder section
function scrollToCofounderSection() {
  const cofounderSection = document.getElementById("cofounder")
  if (cofounderSection) {
    cofounderSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Add co-founder section to navigation (optional)
const navMenu = document.getElementById("nav-menu")
if (navMenu) {
  const cofounderNavLink = document.createElement("a")
  cofounderNavLink.href = "#cofounder"
  cofounderNavLink.className = "nav-link"
  cofounderNavLink.textContent = "Co-founder"
  cofounderNavLink.addEventListener("click", (e) => {
    e.preventDefault()
    scrollToCofounderSection()
    // Close mobile menu if open
    hamburger.classList.remove("active")
    navMenu.classList.remove("active")
  })

  // Insert before the Contact link
  const contactLink = navMenu.querySelector('a[href="#contact"]')
  if (contactLink) {
    navMenu.insertBefore(cofounderNavLink, contactLink)
  }
}

// Intersection Observer for co-founder section animations
const cofounderObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
    }
  })
}, observerOptions)

// Add animation to co-founder elements
document.addEventListener("DOMContentLoaded", () => {
  const cofounderElements = document.querySelectorAll(".cofounder-card, .benefit-item")
  cofounderElements.forEach((el) => {
    el.classList.add("fade-in")
    cofounderObserver.observe(el)
  })
})

// Enhanced form validation for Tally.so integration
function validateCofounderApplication() {
  // This function can be used to add pre-validation before redirecting to Tally
  // For example, checking if user has filled out basic info first

  const userEmail = localStorage.getItem("userEmail") // From waitlist signup
  if (userEmail) {
    // Pre-populate Tally form with email if possible
    console.log("User email available for pre-population:", userEmail)
  }

  return true
}

// Add validation to all co-founder CTAs
document.querySelectorAll('a[href="https://tally.so/r/3jAJdJ"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    if (!validateCofounderApplication()) {
      e.preventDefault()
      // Show validation message or redirect to signup first
    }
  })
})

// A/B Testing for co-founder CTA (optional)
function initCofounderABTest() {
  const testVariant = Math.random() < 0.5 ? "A" : "B"

  if (testVariant === "B") {
    // Variant B: Different CTA text
    const ctaButtons = document.querySelectorAll(".cofounder-primary-btn span")
    ctaButtons.forEach((span) => {
      if (span.textContent === "Become a Co-founder") {
        span.textContent = "Join the Team"
      }
    })
  }

  // Track which variant the user sees
  const gtag = window.gtag // Assuming gtag is available globally
  if (typeof gtag !== "undefined") {
    gtag("event", "cofounder_ab_test", {
      event_category: "experiment",
      event_label: `variant_${testVariant}`,
      custom_parameter_1: testVariant,
    })
  }
}

// Initialize A/B test (uncomment to enable)
// initCofounderABTest()

// Urgency timer for co-founder applications (optional)
function initUrgencyTimer() {
  const urgencyElement = document.querySelector(".cofounder-note")
  if (urgencyElement) {
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 30) // 30 days from now

    function updateTimer() {
      const now = new Date()
      const timeLeft = deadline - now
      const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))

      if (daysLeft > 0) {
        urgencyElement.innerHTML = `
          <i class="fas fa-clock"></i>
          Applications close in ${daysLeft} days. Apply early for the best opportunity.
        `
      }
    }

    updateTimer()
    setInterval(updateTimer, 1000 * 60 * 60) // Update every hour
  }
}

// Initialize urgency timer (uncomment to enable)
// initUrgencyTimer()
