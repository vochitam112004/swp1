
CREATE DATABASE QuitSmokingSupport;
GO
USE QuitSmokingSupport;
GO

CREATE TABLE [User] (
    user_id INT PRIMARY KEY,
    username VARCHAR(50),
    password_hash VARCHAR(255),
    display_name VARCHAR(100),
    user_type VARCHAR(20), -- member, coach, admin
    avatar_url VARCHAR(255),
    is_active BIT,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE MemberProfile (
    member_id INT PRIMARY KEY,
    smoking_status VARCHAR(20), -- smoking, quit, relapsed
    quit_attempts INT,
    experience_level INT,
    previous_attempts TEXT,
    FOREIGN KEY (member_id) REFERENCES [User](user_id)
);

CREATE TABLE CoachProfile (
    coach_id INT PRIMARY KEY,
    specialization TEXT,
    FOREIGN KEY (coach_id) REFERENCES [User](user_id)
);

CREATE TABLE GoalTemplate (
    template_id INT PRIMARY KEY,
    description TEXT
);

CREATE TABLE GoalPlan (
    plan_id INT PRIMARY KEY,
    member_id INT,
    start_date DATE,
    target_quit_date DATE,
    personal_motivation TEXT,
    use_template BIT,
    FOREIGN KEY (member_id) REFERENCES MemberProfile(member_id)
);

CREATE TABLE MemberGoal (
    member_goal_id INT PRIMARY KEY,
    member_id INT,
    goal_id INT,
    status VARCHAR(20), -- active, completed, failed
    FOREIGN KEY (member_id) REFERENCES MemberProfile(member_id),
    FOREIGN KEY (goal_id) REFERENCES GoalPlan(plan_id)
);

CREATE TABLE TriggerFactor (
    trigger_id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE MemberTrigger (
    member_trigger_id INT PRIMARY KEY,
    member_id INT,
    trigger_id INT,
    FOREIGN KEY (member_id) REFERENCES MemberProfile(member_id),
    FOREIGN KEY (trigger_id) REFERENCES TriggerFactor(trigger_id)
);

CREATE TABLE ProgressLog (
    log_id INT PRIMARY KEY,
    member_id INT,
    log_date DATE,
    cigarettes_smoked INT,
    mood VARCHAR(50),
    [trigger] TEXT,
    notes TEXT,
    FOREIGN KEY (member_id) REFERENCES MemberProfile(member_id)
);

CREATE TABLE Notification (
    notification_id INT PRIMARY KEY,
    member_id INT,
    content TEXT,
    type VARCHAR(20), -- reminder, milestone, coach_msg
    is_read BIT,
    created_at DATETIME,
    FOREIGN KEY (member_id) REFERENCES MemberProfile(member_id)
);

CREATE TABLE ChatMessage (
    message_id INT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    content TEXT,
    sent_at DATETIME,
    is_read BIT,
    FOREIGN KEY (sender_id) REFERENCES [User](user_id),
    FOREIGN KEY (receiver_id) REFERENCES [User](user_id)
);

CREATE TABLE Appointment (
    appointment_id INT PRIMARY KEY,
    member_id INT,
    coach_id INT,
    start_time DATETIME,
    end_time DATETIME,
    status VARCHAR(20), -- scheduled, completed, cancelled
    notes TEXT,
    FOREIGN KEY (member_id) REFERENCES MemberProfile(member_id),
    FOREIGN KEY (coach_id) REFERENCES CoachProfile(coach_id)
);

CREATE TABLE CommunityPost (
    post_id INT PRIMARY KEY,
    member_id INT,
    content TEXT,
    created_at DATETIME,
    FOREIGN KEY (member_id) REFERENCES MemberProfile(member_id)
);

CREATE TABLE CommunityInteraction (
    interaction_id INT PRIMARY KEY,
    post_id INT,
    user_id INT,
    comment_content TEXT,
    commented_at DATETIME,
    FOREIGN KEY (post_id) REFERENCES CommunityPost(post_id),
    FOREIGN KEY (user_id) REFERENCES [User](user_id)
);

CREATE TABLE Feedback (
    feedback_id INT PRIMARY KEY,
    user_id INT,
    type VARCHAR(20), -- bug, suggestion, other
    content TEXT,
    submitted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES [User](user_id)
);

CREATE TABLE Ranking (
    ranking_id INT PRIMARY KEY,
    user_id INT,
    score INT,
    last_updated DATETIME,
    FOREIGN KEY (user_id) REFERENCES [User](user_id)
);

CREATE TABLE Badge (
    badge_id INT PRIMARY KEY,
    name VARCHAR(50),
    description TEXT,
    icon_url VARCHAR(255)
);

CREATE TABLE UserBadge (
    user_id INT,
    badge_id INT,
    earned_at DATETIME,
    PRIMARY KEY (user_id, badge_id),
    FOREIGN KEY (user_id) REFERENCES [User](user_id),
    FOREIGN KEY (badge_id) REFERENCES Badge(badge_id)
);

CREATE TABLE AdminProfile (
    admin_id INT PRIMARY KEY,
    permission_level VARCHAR(20), -- moderate, full
    FOREIGN KEY (admin_id) REFERENCES [User](user_id)
);

CREATE TABLE SystemReport (
    report_id INT PRIMARY KEY,
    reporter_id INT,
    report_type VARCHAR(20), -- bug, abuse, feedback
    reported_at DATETIME,
    details TEXT,
    FOREIGN KEY (reporter_id) REFERENCES [User](user_id)
);
