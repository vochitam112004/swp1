import React from 'react';
import { 
    Box, 
    Button, 
    Chip, 
    IconButton, 
    Link, 
    Tooltip, 
    Typography 
} from '@mui/material';
import { 
    VideoCall as VideoIcon,
    ContentCopy as CopyIcon,
    Launch as LaunchIcon,
    Link as LinkIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { copyToClipboard, formatMeetingLinkForDisplay } from '../../utils/googleMeetUtils';

/**
 * GoogleMeetLink Component
 * Hiển thị Google Meet link với các tùy chọn copy, join, etc.
 */
const GoogleMeetLink = ({ 
    meetingLink, 
    variant = 'button', // 'button', 'chip', 'link', 'compact'
    size = 'small',
    showCopy = true,
    showIcon = true,
    disabled = false,
    className = '',
    sx = {}
}) => {
    const handleCopyLink = async () => {
        const result = await copyToClipboard(meetingLink);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    // Nếu không có link
    if (!meetingLink) {
        return (
            <Chip 
                label="Chưa có link" 
                size={size} 
                variant="outlined" 
                color="default"
                className={className}
                sx={sx}
            />
        );
    }

    // Variant: Button (default)
    if (variant === 'button') {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', ...sx }}>
                <Button
                    size={size}
                    color="primary"
                    href={meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={showIcon ? <VideoIcon /> : null}
                    endIcon={<LaunchIcon />}
                    disabled={disabled}
                    className={className}
                >
                    Tham gia
                </Button>
                {showCopy && (
                    <Tooltip title="Copy link">
                        <IconButton 
                            size={size} 
                            onClick={handleCopyLink}
                            disabled={disabled}
                        >
                            <CopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        );
    }

    // Variant: Chip
    if (variant === 'chip') {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
                <Chip
                    label="Google Meet"
                    size={size}
                    color="primary"
                    icon={showIcon ? <VideoIcon /> : null}
                    onClick={() => window.open(meetingLink, '_blank')}
                    disabled={disabled}
                    className={className}
                />
                {showCopy && (
                    <Tooltip title="Copy link">
                        <IconButton 
                            size="small" 
                            onClick={handleCopyLink}
                            disabled={disabled}
                        >
                            <CopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        );
    }

    // Variant: Link
    if (variant === 'link') {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
                <Link
                    href={meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    className={className}
                >
                    {showIcon && <VideoIcon fontSize="small" />}
                    Tham gia Meeting
                </Link>
                {showCopy && (
                    <Tooltip title="Copy link">
                        <IconButton 
                            size="small" 
                            onClick={handleCopyLink}
                            disabled={disabled}
                        >
                            <CopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        );
    }

    // Variant: Compact
    if (variant === 'compact') {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ...sx }}>
                <Tooltip title="Tham gia Google Meet">
                    <IconButton 
                        size={size}
                        color="primary"
                        href={meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        disabled={disabled}
                        className={className}
                    >
                        <VideoIcon />
                    </IconButton>
                </Tooltip>
                {showCopy && (
                    <Tooltip title="Copy link">
                        <IconButton 
                            size={size} 
                            onClick={handleCopyLink}
                            disabled={disabled}
                        >
                            <CopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        );
    }

    // Default fallback
    return (
        <Typography variant="body2" className={className} sx={sx}>
            {formatMeetingLinkForDisplay(meetingLink)}
        </Typography>
    );
};

export default GoogleMeetLink;
