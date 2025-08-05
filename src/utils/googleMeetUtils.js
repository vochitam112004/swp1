/**
 * Google Meet Utilities
 * Các hàm tiện ích để làm việc với Google Meet links
 */

// Tự động tạo Google Meet link (mô phỏng)
export const generateGoogleMeetLink = () => {
    // Tạo random meeting ID (trong thực tế sẽ dùng Google Meet API)
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    const randomString = Array.from({length: 3}, () => 
        Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    ).join('-')
    return `https://meet.google.com/${randomString}`
}

// Copy link to clipboard
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        return { success: true, message: 'Đã copy link vào clipboard!' }
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
            document.execCommand('copy')
            document.body.removeChild(textArea)
            return { success: true, message: 'Đã copy link vào clipboard!' }
        } catch (fallbackError) {
            document.body.removeChild(textArea)
            return { success: false, message: 'Không thể copy link' }
        }
    }
}

// Validate Google Meet link
export const isValidGoogleMeetLink = (link) => {
    if (!link) return true // Allow empty
    const googleMeetPattern = /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/
    const googleMeetGenericPattern = /^https:\/\/meet\.google\.com\/[a-zA-Z0-9\-_]+$/
    return googleMeetPattern.test(link) || googleMeetGenericPattern.test(link)
}

// Extract meeting ID from Google Meet link
export const extractMeetingId = (link) => {
    if (!link) return null
    const match = link.match(/meet\.google\.com\/([a-zA-Z0-9\-_]+)/)
    return match ? match[1] : null
}

// Format Google Meet link for display
export const formatMeetingLinkForDisplay = (link) => {
    if (!link) return 'Chưa có'
    const meetingId = extractMeetingId(link)
    return meetingId ? `meet.google.com/${meetingId}` : link
}

// Check if link is accessible (mô phỏng)
export const checkMeetingLinkStatus = async (link) => {
    if (!link || !isValidGoogleMeetLink(link)) {
        return { status: 'invalid', message: 'Link không hợp lệ' }
    }
    
    // Mô phỏng kiểm tra trạng thái link
    // Trong thực tế có thể gọi API để kiểm tra
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        return { status: 'active', message: 'Link hoạt động bình thường' }
    } catch (error) {
        return { status: 'error', message: 'Không thể kiểm tra trạng thái link' }
    }
}

// Create meeting with specific details (mô phỏng Google Calendar API)
export const createScheduledMeeting = async (meetingDetails) => {
    const { title, startTime, endTime, description } = meetingDetails
    
    // Mô phỏng tạo meeting với Google Calendar API
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const meetingLink = generateGoogleMeetLink()
        
        return {
            success: true,
            meetingLink,
            meetingId: extractMeetingId(meetingLink),
            title,
            startTime,
            endTime,
            description,
            created: new Date().toISOString()
        }
    } catch (error) {
        return {
            success: false,
            error: 'Không thể tạo meeting'
        }
    }
}

export default {
    generateGoogleMeetLink,
    copyToClipboard,
    isValidGoogleMeetLink,
    extractMeetingId,
    formatMeetingLinkForDisplay,
    checkMeetingLinkStatus,
    createScheduledMeeting
}
