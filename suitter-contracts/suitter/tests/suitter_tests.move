#[test_only]
module suitter::suitter_tests {
    use suitter::suitter::{
        Self,
        Suit,
        Profile,
        Like,
        Comment
    };
    use sui::test_scenario::{Self as test, Scenario, next_tx, ctx};
    use std::string;

    // Test addresses
    const ALICE: address = @0xA;
    const BOB: address = @0xB;
    const CHARLIE: address = @0xC;

    // Helper function to create a test scenario
    fun setup_test(): Scenario {
        test::begin(ALICE)
    }

    // ==================== PROFILE TESTS ====================

    #[test]
    fun test_create_profile_success() {
        let mut scenario = setup_test();

        // Alice creates a profile
        next_tx(&mut scenario, ALICE);
        {
            let profile = suitter::create_profile(
                b"Alice",
                b"Software Engineer | Blockchain Enthusiast",
                b"https://example.com/alice.jpg",
                ctx(&mut scenario)
            );

            // Verify profile fields
            assert!(suitter::get_profile_owner(&profile) == ALICE, 0);
            assert!(suitter::get_profile_username(&profile) == &string::utf8(b"Alice"), 1);
            assert!(suitter::get_profile_bio(&profile) == &string::utf8(b"Software Engineer | Blockchain Enthusiast"), 2);
            assert!(suitter::get_profile_image(&profile) == &string::utf8(b"https://example.com/alice.jpg"), 3);

            // Transfer profile to Alice
            sui::transfer::public_transfer(profile, ALICE);
        };

        test::end(scenario);
    }

    #[test]
    fun test_update_profile_by_owner() {
        let mut scenario = setup_test();

        // Alice creates a profile
        next_tx(&mut scenario, ALICE);
        {
            let profile = suitter::create_profile(
                b"Alice",
                b"Old bio",
                b"old_image.jpg",
                ctx(&mut scenario)
            );
            sui::transfer::public_transfer(profile, ALICE);
        };

        // Alice updates her profile
        next_tx(&mut scenario, ALICE);
        {
            let mut profile = test::take_from_sender<Profile>(&scenario);

            suitter::update_profile(
                &mut profile,
                b"Alice Updated",
                b"New bio - Web3 Developer",
                b"new_image.jpg",
                ctx(&mut scenario)
            );

            // Verify updates
            assert!(suitter::get_profile_username(&profile) == &string::utf8(b"Alice Updated"), 0);
            assert!(suitter::get_profile_bio(&profile) == &string::utf8(b"New bio - Web3 Developer"), 1);
            assert!(suitter::get_profile_image(&profile) == &string::utf8(b"new_image.jpg"), 2);

            test::return_to_sender(&scenario, profile);
        };

        test::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = suitter::ENotOwner)]
    fun test_update_profile_fails_for_non_owner() {
        let mut scenario = setup_test();

        // Alice creates a profile
        next_tx(&mut scenario, ALICE);
        {
            let profile = suitter::create_profile(
                b"Alice",
                b"Bio",
                b"image.jpg",
                ctx(&mut scenario)
            );
            // Transfer to Alice but we'll try to modify as Bob
            sui::transfer::public_transfer(profile, ALICE);
        };

        // Bob tries to update Alice's profile (should fail)
        next_tx(&mut scenario, BOB);
        {
            let mut profile = test::take_from_address<Profile>(&scenario, ALICE);

            suitter::update_profile(
                &mut profile,
                b"Hacked",
                b"Hacked bio",
                b"hacked.jpg",
                ctx(&mut scenario) // ctx has BOB as sender
            );

            test::return_to_address(ALICE, profile);
        };

        test::end(scenario);
    }

    // ==================== POSTING TESTS ====================

    #[test]
    fun test_post_suit_success() {
        let mut scenario = setup_test();

        // Alice posts a suit
        next_tx(&mut scenario, ALICE);
        {
            suitter::post_suit(
                b"Hello Suitter! This is my first post on the blockchain!",
                ctx(&mut scenario)
            );
        };

        // Verify the suit was created and shared
        next_tx(&mut scenario, ALICE);
        {
            let suit = test::take_shared<Suit>(&scenario);

            assert!(suitter::get_suit_author(&suit) == ALICE, 0);
            assert!(suitter::get_suit_content(&suit) == &string::utf8(b"Hello Suitter! This is my first post on the blockchain!"), 1);
            // Note: timestamp_ms will be 0 in test environment
            // In production, ctx.epoch_timestamp_ms() returns actual blockchain time

            test::return_shared(suit);
        };

        test::end(scenario);
    }

    #[test]
    fun test_multiple_users_can_post() {
        let mut scenario = setup_test();

        // Alice posts
        next_tx(&mut scenario, ALICE);
        {
            suitter::post_suit(
                b"Alice's post",
                ctx(&mut scenario)
            );
        };

        // Bob posts
        next_tx(&mut scenario, BOB);
        {
            suitter::post_suit(
                b"Bob's post",
                ctx(&mut scenario)
            );
        };

        // Charlie posts
        next_tx(&mut scenario, CHARLIE);
        {
            suitter::post_suit(
                b"Charlie's post",
                ctx(&mut scenario)
            );
        };

        // In a real scenario, you would query all shared Suit objects
        // For testing, we verify they exist by taking them
        next_tx(&mut scenario, ALICE);
        {
            // Note: In actual test scenarios with multiple shared objects,
            // you'd need to track IDs to take specific objects
            // This is simplified for demonstration
        };

        test::end(scenario);
    }

    // ==================== LIKE TESTS ====================

    #[test]
    fun test_add_like_to_post() {
        let mut scenario = setup_test();
        let suit_id;

        // Alice creates a post
        next_tx(&mut scenario, ALICE);
        {
            suitter::post_suit(
                b"Like this post!",
                ctx(&mut scenario)
            );
        };

        // Get the suit ID
        next_tx(&mut scenario, ALICE);
        {
            let suit = test::take_shared<Suit>(&scenario);
            suit_id = suitter::get_suit_id(&suit);
            test::return_shared(suit);
        };

        // Bob likes Alice's post
        next_tx(&mut scenario, BOB);
        {
            suitter::add_like(
                suit_id,
                ctx(&mut scenario)
            );
        };

        // Verify the like was created
        next_tx(&mut scenario, BOB);
        {
            let like = test::take_shared<Like>(&scenario);

            assert!(suitter::get_like_suit_id(&like) == suit_id, 0);
            assert!(suitter::get_like_liker(&like) == BOB, 1);

            test::return_shared(like);
        };

        test::end(scenario);
    }

    #[test]
    fun test_multiple_users_can_like_same_post() {
        let mut scenario = setup_test();
        let suit_id;

        // Alice creates a post
        next_tx(&mut scenario, ALICE);
        {
            suitter::post_suit(
                b"Popular post!",
                ctx(&mut scenario)
            );
        };

        // Get the suit ID
        next_tx(&mut scenario, ALICE);
        {
            let suit = test::take_shared<Suit>(&scenario);
            suit_id = suitter::get_suit_id(&suit);
            test::return_shared(suit);
        };

        // Bob likes it
        next_tx(&mut scenario, BOB);
        {
            suitter::add_like(suit_id, ctx(&mut scenario));
        };

        // Charlie also likes it
        next_tx(&mut scenario, CHARLIE);
        {
            suitter::add_like(suit_id, ctx(&mut scenario));
        };

        // In a real frontend, you would query all Like objects
        // where suit_id matches to count total likes

        test::end(scenario);
    }

    // ==================== COMMENT TESTS ====================

    #[test]
    fun test_add_comment_to_post() {
        let mut scenario = setup_test();
        let suit_id;

        // Alice creates a post
        next_tx(&mut scenario, ALICE);
        {
            suitter::post_suit(
                b"What do you think about Sui?",
                ctx(&mut scenario)
            );
        };

        // Get the suit ID
        next_tx(&mut scenario, ALICE);
        {
            let suit = test::take_shared<Suit>(&scenario);
            suit_id = suitter::get_suit_id(&suit);
            test::return_shared(suit);
        };

        // Bob comments on Alice's post
        next_tx(&mut scenario, BOB);
        {
            suitter::add_comment(
                suit_id,
                b"Sui is amazing! Love the object model.",
                ctx(&mut scenario)
            );
        };

        // Verify the comment was created
        next_tx(&mut scenario, BOB);
        {
            let comment = test::take_shared<Comment>(&scenario);

            assert!(suitter::get_comment_suit_id(&comment) == suit_id, 0);
            assert!(suitter::get_comment_author(&comment) == BOB, 1);
            assert!(suitter::get_comment_content(&comment) == &string::utf8(b"Sui is amazing! Love the object model."), 2);
            // Note: timestamp_ms will be 0 in test environment

            test::return_shared(comment);
        };

        test::end(scenario);
    }

    #[test]
    fun test_multiple_comments_on_same_post() {
        let mut scenario = setup_test();
        let suit_id;

        // Alice creates a post
        next_tx(&mut scenario, ALICE);
        {
            suitter::post_suit(
                b"Discuss: Best features of Move language?",
                ctx(&mut scenario)
            );
        };

        // Get the suit ID
        next_tx(&mut scenario, ALICE);
        {
            let suit = test::take_shared<Suit>(&scenario);
            suit_id = suitter::get_suit_id(&suit);
            test::return_shared(suit);
        };

        // Bob comments
        next_tx(&mut scenario, BOB);
        {
            suitter::add_comment(
                suit_id,
                b"Resource safety is incredible!",
                ctx(&mut scenario)
            );
        };

        // Charlie comments
        next_tx(&mut scenario, CHARLIE);
        {
            suitter::add_comment(
                suit_id,
                b"I love the ability system!",
                ctx(&mut scenario)
            );
        };

        // Alice replies to her own post
        next_tx(&mut scenario, ALICE);
        {
            suitter::add_comment(
                suit_id,
                b"Great insights everyone!",
                ctx(&mut scenario)
            );
        };

        // In frontend: query all Comments where suit_id matches
        // to display the comment thread

        test::end(scenario);
    }

    // ==================== INTEGRATION TESTS ====================

    #[test]
    fun test_full_user_workflow() {
        let mut scenario = setup_test();

        // Step 1: Alice creates her profile
        next_tx(&mut scenario, ALICE);
        {
            let profile = suitter::create_profile(
                b"Alice",
                b"Blockchain Developer",
                b"alice.jpg",
                ctx(&mut scenario)
            );
            sui::transfer::public_transfer(profile, ALICE);
        };

        // Step 2: Alice posts a suit
        next_tx(&mut scenario, ALICE);
        {
            suitter::post_suit(
                b"Just deployed my first Sui smart contract!",
                ctx(&mut scenario)
            );
        };

        // Step 3: Bob creates his profile
        next_tx(&mut scenario, BOB);
        {
            let profile = suitter::create_profile(
                b"Bob",
                b"Sui Enthusiast",
                b"bob.jpg",
                ctx(&mut scenario)
            );
            sui::transfer::public_transfer(profile, BOB);
        };

        // Step 4: Bob likes Alice's post
        let suit_id;
        next_tx(&mut scenario, BOB);
        {
            let suit = test::take_shared<Suit>(&scenario);
            suit_id = suitter::get_suit_id(&suit);
            test::return_shared(suit);
        };

        next_tx(&mut scenario, BOB);
        {
            suitter::add_like(suit_id, ctx(&mut scenario));
        };

        // Step 5: Bob comments on Alice's post
        next_tx(&mut scenario, BOB);
        {
            suitter::add_comment(
                suit_id,
                b"Congratulations! Welcome to Sui!",
                ctx(&mut scenario)
            );
        };

        // Step 6: Alice updates her profile
        next_tx(&mut scenario, ALICE);
        {
            let mut profile = test::take_from_sender<Profile>(&scenario);
            suitter::update_profile(
                &mut profile,
                b"Alice - Smart Contract Dev",
                b"Blockchain Developer | Sui Move Expert",
                b"alice_updated.jpg",
                ctx(&mut scenario)
            );
            test::return_to_sender(&scenario, profile);
        };

        test::end(scenario);
    }

    #[test]
    fun test_empty_content_allowed() {
        let mut scenario = setup_test();

        // Post with empty content (edge case)
        next_tx(&mut scenario, ALICE);
        {
            suitter::post_suit(
                b"",
                ctx(&mut scenario)
            );
        };

        next_tx(&mut scenario, ALICE);
        {
            let suit = test::take_shared<Suit>(&scenario);
            assert!(suitter::get_suit_content(&suit) == &string::utf8(b""), 0);
            test::return_shared(suit);
        };

        test::end(scenario);
    }

    #[test]
    fun test_long_content() {
        let mut scenario = setup_test();

        // Post with very long content
        next_tx(&mut scenario, ALICE);
        {
            suitter::post_suit(
                b"This is a very long post that contains a lot of text. In a
                real social network, you might want to impose character limits, but for
                this demo we allow unlimited length. This tests that the smart contract can
                handle longer strings without issues. The
                Sui blockchain can store this data efficiently using its object model.",
                ctx(&mut scenario)
            );
        };

        test::end(scenario);
    }
}
