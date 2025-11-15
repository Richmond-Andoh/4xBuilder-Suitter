module suitter::suitter {
    use std::string::{String, utf8};

    // Error codes
    const ENotOwner: u64 = 0;

    // Suit (Post) - represents a social media post
    // Shared publicly so the frontend can query and display all posts
    public struct Suit has key, store {
        id: UID,
        author: address,
        content: String,
        timestamp_ms: u64,
    }

    // Profile - user identity with username, bio, and profile image
    // Owned by user, stores their persistent social identity
    public struct Profile has key, store {
        id: UID,
        owner: address,
        username: String,
        bio: String,
        image_url: String,
    }

    // Like - represents a user liking a specific post
    // Shared publicly for querying like counts per post
    public struct Like has key, store {
        id: UID,
        suit_id: ID,
        liker: address,
    }

    // Comment - represents a comment on a specific post
    // Shared publicly for displaying comment threads
    public struct Comment has key, store {
        id: UID,
        suit_id: ID,
        author: address,
        content: String,
        timestamp_ms: u64,
    }

    // Create a new user profile and return it
    // Caller can then transfer it or use it in the same transaction
    public fun create_profile(
        username: vector<u8>,
        bio: vector<u8>,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let profile = Profile {
            id: sui::object::new(ctx),
            owner: sender,
            username: utf8(username),
            bio: utf8(bio),
            image_url: utf8(image_url),
        };

        transfer::transfer(profile, sender);

    }

    // Update an existing profile
    // Only the profile owner can modify their profile
    public fun update_profile(
        profile: &mut Profile,
        new_username: vector<u8>,
        new_bio: vector<u8>,
        new_image_url: vector<u8>,
        ctx: &TxContext
    ) {
        assert!(profile.owner == ctx.sender(), ENotOwner);
        profile.username = utf8(new_username);
        profile.bio = utf8(new_bio);
        profile.image_url = utf8(new_image_url);
    }

    // Create and publish a new post (Suit)
    // Posts are shared publicly for the global feed
    public fun post_suit(
        content: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let suit = Suit {
            id: sui::object::new(ctx),
            author: sender,
            content: utf8(content),
            timestamp_ms: ctx.epoch_timestamp_ms(),
        };
        sui::transfer::public_share_object(suit);
    }

    // Add a like to a specific post
    public fun add_like(
        suit_id: ID,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let like = Like {
            id: sui::object::new(ctx),
            suit_id,
            liker: sender,
        };
        sui::transfer::public_share_object(like);
    }

    // Add a comment to a specific post
    public fun add_comment(
        suit_id: ID,
        content: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let comment = Comment {
            id: sui::object::new(ctx),
            suit_id,
            author: sender,
            content: utf8(content),
            timestamp_ms: ctx.epoch_timestamp_ms(),
        };
        sui::transfer::public_share_object(comment);
    }

    // Getter functions for accessing Suit fields
    public fun get_suit_id(suit: &Suit): ID {
        sui::object::id(suit)
    }

    public fun get_suit_author(suit: &Suit): address {
        suit.author
    }

    public fun get_suit_content(suit: &Suit): &String {
        &suit.content
    }

    public fun get_suit_timestamp(suit: &Suit): u64 {
        suit.timestamp_ms
    }

    // Getter functions for accessing Profile fields
    public fun get_profile_owner(profile: &Profile): address {
        profile.owner
    }

    public fun get_profile_username(profile: &Profile): &String {
        &profile.username
    }

    public fun get_profile_bio(profile: &Profile): &String {
        &profile.bio
    }

    public fun get_profile_image(profile: &Profile): &String {
        &profile.image_url
    }

    public fun get_like_suit_id(like: &Like): ID {
        like.suit_id
    }

    public fun get_like_liker(like: &Like): address {
        like.liker
    }

    // Getter functions for accessing Comment fields
    public fun get_comment_suit_id(comment: &Comment): ID {
        comment.suit_id
    }

    public fun get_comment_author(comment: &Comment): address {
        comment.author
    }

    public fun get_comment_content(comment: &Comment): &String {
        &comment.content
    }

    public fun get_comment_timestamp(comment: &Comment): u64 {
        comment.timestamp_ms
    }
}
