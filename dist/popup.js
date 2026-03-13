"use strict";
(() => {
  // src/i18n/en.ts
  var en = {
    popup: {
      locale: {
        english: "English",
        ukrainian: "Українська"
      },
      intro: "Guided VK collection workflow for the current target. Saves locally, builds an investigator-ready report, and keeps live extraction state visible when the popup is reopened.",
      labels: {
        currentVkPage: "Current VK page",
        target: "Target",
        lastAction: "Last action",
        status: "Status",
        case: "Case",
        kind: "Kind",
        runs: "Runs",
        accessToken: "Access token",
        activeExtraction: "ACTIVE EXTRACTION",
        state: "State",
        active: "Active",
        stage: "Stage",
        started: "Started",
        queue: "Queue"
      },
      buttons: {
        rescan: "Rescan",
        reloadTab: "Reload tab",
        clearBusy: "Clear Busy",
        save: "Save",
        clear: "Clear",
        run: "Run",
        exportRawJson: "Export raw JSON",
        openReport: "Open report",
        resetCurrentTarget: "Reset current target",
        refreshList: "Refresh list",
        deleteCurrent: "Delete current",
        deleteAll: "Delete all",
        buildObservedFromWall: "Build Observed network from Wall snapshot"
      },
      workflow: {
        profileNetworkTitle: "Profile & Network",
        profileNetworkHint: "Identity, target context, friends/members, followers, following, communities.",
        mediaCollectionTitle: "Media Collection",
        mediaCollectionHint: "Photos, videos, stories, and gifts where available.",
        wallSnapshotTitle: "Wall Snapshot & Output",
        wallSnapshotHint: "Observed seeding, comments/likes sweep visibility, export, and report launch."
      },
      tasks: {
        profile: "Profile / Group",
        friends: "Friends / Members",
        followers: "Followers",
        following: "Following",
        communities: "Communities",
        wall: "Wall Snapshot / Observed seed",
        photos: "Photos",
        videos: "Videos",
        stories: "Stories",
        gifts: "Gifts"
      },
      wall: {
        posts: "Posts",
        comments: "Comments",
        likes: "Likes",
        maxPosts: "Max posts",
        include: "Include",
        rangeMode: "Range mode",
        dateTimeRange: "date/time range",
        from: "From",
        to: "To",
        snapshotRangeFull: "Snapshot range: full available wall history.",
        snapshotRangeCustom: "Snapshot range: custom date/time mode enabled.",
        snapshotRangeFrom: "Snapshot range: from {value}",
        snapshotRangeTo: "Snapshot range: up to {value}",
        snapshotRangeBetween: "Snapshot range: {from} → {to}"
      },
      finish: {
        title: "Review, export, and manage stored cases",
        hint: "Open the live report, export raw JSON, reset the current target, or manage stored target data in IndexedDB.",
        storageTitle: "Storage management",
        storageHint: "Stored per target (user 123, group -123). Delete old targets if size grows over time."
      },
      footer: {
        notes: "Notes: Some VK data is private. If an API call returns “access denied”, that is normal. Large targets can take time — vkXtract spaces VK API calls globally to reduce blocks, and Wall is snapshot-by-design (you control max posts).",
        legal: "Legal"
      },
      runtime: {
        ready: "Ready",
        idle: "Idle",
        notLoaded: "Not loaded",
        storedLocally: "Stored locally",
        savedLocallyForReuse: "Saved locally for reuse across targets.",
        pasteOrReplaceToken: "Paste or replace VK access_token",
        pasteToken: "Paste VK access_token",
        tokenSaved: "Token saved",
        noTokenLoaded: "No token loaded!",
        openVkTargetToEnable: "Open a VK user or community page to enable extraction.",
        openVkTargetToRescan: "Open a VK user or community page to rescan popup state.",
        working: "Working…",
        starting: "Starting…",
        waiting: "Waiting",
        off: "Off",
        complete: "Complete",
        blocked: "Blocked",
        disabled: "Disabled",
        unknown: "Unknown",
        currentTargetReset: "Current target reset.",
        vkTabReloaded: "VK tab reloaded",
        loading: "Loading…",
        storageListFailed: "Storage list failed.",
        noStoredTargetsYet: "No stored targets yet. Extract a profile to create one.",
        targetsStoredSummary: "Targets stored: {total} (showing {shown}) • Approx size: {size}",
        runsUpdatedSummary: "{kind} {key} • runs: {runs} • updated: {updated}",
        deleteStoredConfirm: "Delete stored data for target {key}?",
        deletedTarget: "Deleted target {key}.",
        queuedTask: "Queued: {task}",
        sessionBusy: "Busy ({reason})",
        buildObservedFallbackHint: "Uses captured wall interactions when the friends/member list is private, denied, or incomplete.",
        notAvailableForCommunityTargets: "Not available for community targets.",
        notAvailableForThisTargetType: "Not available for this target type.",
        running: "Running",
        done: "Done",
        error: "Error",
        active: "Active",
        busyLockCleared: "Busy lock cleared",
        tokenCleared: "Token cleared",
        profileExtracted: "Profile / group extracted.",
        friendsExtracted: "Friends / members list extracted.",
        followersExtracted: "Followers extracted.",
        followingExtracted: "Following extracted.",
        communitiesExtracted: "Communities extracted.",
        photosExtracted: "Photos extracted.",
        videosExtracted: "Videos extracted.",
        storiesExtracted: "Stories extracted.",
        giftsExtracted: "Gifts extracted.",
        wallExtracted: "Wall snapshot extracted.",
        requestFailed: "Request failed",
        ok: "OK",
        deletedCurrentTargetData: "Deleted current target data.",
        deletedAllStoredData: "Deleted all stored vkXtract data.",
        deleteCurrentTargetConfirm: "Delete all stored data for the CURRENT target?",
        deleteAllTargetsConfirm: "Delete ALL stored vkXtract targets? This cannot be undone.",
        storiesExtractedIfAvailable: "Stories extracted (if available).",
        giftsExtractedIfAvailable: "Gifts extracted (if available).",
        delete: "Delete",
        collectedSuffix: "{count} collected",
        noActiveTab: "No active tab",
        notOnVk: "Not on VK",
        unknownError: "Unknown error",
        authorizationFailed: "Authorization failed (invalid/expired token)",
        tooManyRequests: "Too many requests per second (rate limited)",
        permissionDenied: "Permission denied",
        accessDenied: "Access denied",
        userDeletedBanned: "User deleted / banned",
        groupAccessDenied: "Group access denied",
        profilePrivate: "Profile is private",
        vkError: "VK error {code}",
        busyGeneric: "busy"
      }
    },
    report: {
      shell: {
        title: "vkXtract report",
        snapshotTitle: "vkXtract report snapshot",
        loading: "Loading report…",
        building: "Building report…"
      },
      enrichBar: {
        title: "Enrichment running",
        hint: "Stop is available from anywhere in the report.",
        running: "Running…",
        photos: "Photos",
        videos: "Videos",
        friends: "Friends",
        following: "Following",
        followers: "Followers",
        communities: "Communities",
        stopPhoto: "Stop photo enrichment",
        stopVideo: "Stop video enrichment",
        stopFriends: "Stop friends enrichment",
        stopFollowing: "Stop following enrichment",
        stopFollowers: "Stop followers enrichment",
        stopCommunities: "Stop communities enrichment",
        stopAll: "Stop all enrichment"
      },
      tabs: {
        overview: "Overview",
        observed: "Observed",
        wall: "Wall",
        following: "Following",
        followers: "Followers",
        communities: "Communities",
        photos: "Photos",
        videos: "Videos",
        stories: "Stories",
        gifts: "Gifts",
        rawJson: "Raw JSON",
        runs: "Runs"
      },
      common: {
        exportCasePackage: "Export case package",
        notAvailableForGroupExtractions: "Not available for group extractions.",
        generatedLocallyFooter: "Generated locally by vkXtract. Tabs below summarise extracted data; the full capture is preserved in Raw JSON.",
        rawJsonTitle: "Raw JSON",
        rawJsonSub: "Full capture bundle (schema: {schema})",
        target: "Target",
        targetDisplayName: "Target Display name",
        dateTimeRetrieved: "Date and time retrieved",
        targetUrl: "Target URL",
        showRawResponse: "Show raw response",
        capturedAt: "Captured: {value}",
        showingOfTotal: "Showing {shown}{totalPart}{cappedPart}",
        totalPart: " of {total}",
        cappedPart: " (capped)",
        clipsIncluded: " • Clips: {count} (included below)",
        itemsCount: "Items: {count}",
        profilesPagesTotal: "Profiles: {profiles} • Pages: {pages}{totalPart}{cappedPart}",
        totalOnly: " • Total: {total}",
        sourceLabel: " • Source: {value}.",
        sourceShort: "Source",
        sourceUserGet: "user.get",
        sourceFriendsGet: "friends.get",
        sourceGroupsGetMembers: "groups.getMembers",
        sourceUnresolved: "unresolved",
        photoShort: "photo",
        videoShort: "video",
        geocodedPlace: "geocoded place",
        linkEvidence: "Link evidence",
        likedPill: "Liked",
        copiedPill: "Copied",
        commentsCaptured: "Comments captured",
        repliesLabel: "Replies",
        poster: "Poster",
        noThumbnail: "No thumbnail",
        mousewheelToZoom: "Mousewheel to zoom",
        openExternal: "Open external",
        resetZoom: "Reset zoom",
        close: "Close",
        zoom: "Zoom",
        player: "Player",
        reset: "Reset",
        hq: "HQ",
        openDetails: "Open details",
        lightboxHint: "Mousewheel to zoom • Drag to pan • Double-click to reset",
        showDetails: "Show details",
        linkToMedia: "Link to media",
        offlineCopyRecorded: "Offline copy already recorded for this item",
        videoOfflineNotEnabled: "Actual offline copy for videos/clips is not enabled yet because the current bundle stores player/thumbnail URLs rather than a direct media file URL.",
        reEnrichThisMedia: "Re-enrich this media",
        enrichThisMedia: "Enrich this media",
        exportPackageTitle: "Export case package",
        exportPackageSub: "Folder-first package build for offline review. The export is self-contained when unzipped into its own folder structure.",
        extractionRunsTitle: "Extraction runs",
        newestFirst: "Newest first.",
        clipsTitle: "Clips",
        clipsMergedSub: "Merged into Videos for investigator convenience. Clips remain visually separate inside this section but no longer need a dedicated tab.",
        clipsSeeTab: " • Clips: {count} (see Clips tab)",
        photoThumbnailAlt: "Photo thumbnail",
        clipThumbnailAlt: "Clip thumbnail",
        videoThumbnailAlt: "Video thumbnail",
        photoOfflineRecorded: "Offline copy already recorded for this photo",
        makePhotoOfflineCopy: "Make offline copy (photo)",
        reEnrich: "Re-enrich",
        enrich: "Enrich",
        idLabel: "ID",
        dateLabel: "Date",
        latLngLabel: "Lat/Lng",
        durationLabel: "Duration",
        viewsLabel: "Views",
        likesLabel: "Likes",
        uniqueLabel: "Unique",
        periodDay: "Day",
        periodWeek: "Week",
        periodMonth: "Month",
        periodYear: "Year",
        reactionsLikesTab: "Reactions (likes)",
        combinedTab: "Combined",
        overlapTab: "Overlap",
        hotspotsTab: "Hotspots",
        recencyTab: "Recency",
        engagementTitle: "Engagement",
        engagementAnalysisPhotos: "Engagement analysis (photos)",
        engagementAnalysisVideos: "Engagement analysis (videos)",
        topEngager: "Top engager",
        noEngagersCapturedYet: "No engagers captured yet.",
        rawCapturedSamples: "Raw captured samples",
        engagementIfEnriched: "Engagement (if enriched)",
        notEnoughObservedChartEvidence: "Not enough wall interaction evidence exists yet to build the Observed chart.",
        capLabel: "cap",
        noItemCap: "no item cap",
        analysisProgressNote: "Analysis updates during enrichment and currently reflects {processed} processed items ({capText}).",
        noActionsCaptured: "No actions captured",
        noCommentTextCapturedForEdge: "No comment text captured for this edge.",
        repostCopyAction: "Repost/Copy",
        repostAction: "Repost",
        commentTimes: "Comment ×{count}",
        replyTimes: "Reply ×{count}",
        noTextLabel: "(no text)",
        enrichThisUser: "Enrich this user",
        familyRoleTarget: "Target",
        familyRolePartner: "Partner",
        familyRoleParent: "Parent",
        familyRoleChild: "Child",
        familyRoleGrandparent: "Grandparent",
        familyRoleGrandchild: "Grandchild",
        familyRoleSibling: "Sibling",
        familyRoleRelative: "Relative",
        familyRoleAuntUncle: "Aunt / uncle",
        familyRoleNieceNephew: "Niece / nephew",
        familyRoleCousin: "Cousin",
        photoGeolocationMap: "Photo geolocation (map)",
        photoGeolocationHint: "Pins appear for any photo with lat/lng. If engagement enrichment is available for that photo, it will be shown in the detail panel.",
        hotspotTitle: "Hotspot",
        details: "Details",
        noHotspotDataForPhotos: "No hotspot data for photos.",
        noHotspotDataForVideos: "No hotspot data for videos.",
        hotspotAlt: "Hotspot",
        requestParams: "Request params",
        responseLabel: "Response",
        profilePhotosAlbum: "Profile photos",
        savedPhotosAlbum: "Saved photos",
        allVideosAlbum: "All videos",
        attachmentLabel: "Attachment",
        photoLabel: "Photo",
        videoLabel: "Video",
        mediaGenericLabel: "Media",
        showingMappedWallPostsCurrentScope: "Showing {count} mapped wall posts for the current time scope{locationPart}{excludedPart}.",
        locationMatchesPart: " • location matches: {count}",
        noMappedWallPostsCurrentScope: "No mapped wall posts match the current time scope yet.",
        reportLoaderPreparing: "Preparing…",
        reportLoaderLoadingBundle: "Loading bundle…",
        reportLoaderRenderingReport: "Rendering report…",
        reportLoaderFinalising: "Finalising…",
        observedLinkChartToastNotLoaded: "Observed link chart failed: vis-network not loaded",
        observedLinkChartToastInitError: "Observed link chart failed: vis-network init error",
        notAvailableForThisExtraction: "Not available for this extraction.",
        enrichedOneItem: "Enriched 1 item.",
        noMediaItemsFoundAlbumBlock: "No media items found in this album block.",
        enrichedAlbumBatchUpToFive: "Enriched album batch (up to 5 items).",
        noOverlapUsersYet: "No overlap users yet.",
        usersWhoBothLikeAndComment: "Users who both like and comment: {count}.",
        noPhotoEngagementYet: "No photo engagement enrichment yet. Open the report (interactive) and click Enrich photos engagement.",
        noClipsReturnedForTarget: "No clips were returned for this target.",
        capturedMeta: "Captured: {value}",
        noPartnerRelativesReturned: "No partner/relatives were returned, or access was restricted.",
        education: "Education",
        noEducationDataReturned: "No education data returned.",
        workService: "Work & service",
        noCareerMilitaryDataReturned: "No career / military data returned.",
        noLabelExtractedYet: "No {label} extracted yet. Click Extract Friends/Members.",
        noFollowedProfilesReturned: "No followed profiles returned.",
        noFollowedPagesCommunitiesReturned: "No followed pages/communities returned.",
        profilePrivate: "Profile is private",
        profileOpen: "Profile is open",
        verified: "Verified",
        openGroup: "Open group",
        closedGroup: "Closed group",
        privateGroup: "Private group",
        notSpecified: "Not specified",
        noAgeLimit: "No age limit",
        notMemberLong: "Not a member",
        notSure: "Not sure",
        declinedInvitation: "Declined invitation",
        requestSent: "Request sent",
        invited: "Invited",
        female: "Female",
        male: "Male",
        friendStatusValueNotFriends: "Not friends",
        friendStatusValueIncomingRequest: "Incoming request",
        friendStatusValueOutgoingRequest: "Outgoing request",
        friendStatusValueFriends: "Friends",
        occupationTypeWork: "Work",
        occupationTypeSchool: "School",
        occupationTypeUniversity: "University",
        politicalCommunist: "Communist",
        politicalSocialist: "Socialist",
        politicalModerate: "Moderate",
        politicalLiberal: "Liberal",
        politicalConservative: "Conservative",
        politicalMonarchist: "Monarchist",
        politicalUltraconservative: "Ultra-conservative",
        politicalApathetic: "Indifferent",
        politicalLibertarian: "Libertarian",
        peopleIntellectCreativity: "Intellect and creativity",
        peopleKindnessHonesty: "Kindness and honesty",
        peopleHealthBeauty: "Health and beauty",
        peopleWealthPower: "Wealth and power",
        peopleCouragePersistence: "Courage and persistence",
        peopleHumorLife: "Humor and love for life",
        lifeFamilyChildren: "Family and children",
        lifeCareerMoney: "Career and money",
        lifeEntertainmentLeisure: "Entertainment and leisure",
        lifeScienceResearch: "Science and research",
        lifeImprovingWorld: "Improving the world",
        lifePersonalDevelopment: "Personal development",
        lifeBeautyArt: "Beauty and art",
        lifeFameInfluence: "Fame and influence",
        stanceVeryNegative: "Very negative",
        stanceNegative: "Negative",
        stanceNeutral: "Neutral",
        stanceCompromisable: "Compromisable",
        stancePositive: "Positive",
        relationSingle: "Single",
        relationInRelationship: "In a relationship",
        relationEngaged: "Engaged",
        relationMarried: "Married",
        relationComplicated: "It's complicated",
        relationActivelySearching: "Actively searching",
        relationInLove: "In love",
        relationCivilUnion: "In a civil union",
        communityAdministrator: "Community administrator",
        administrator: "Administrator",
        moderator: "Moderator",
        editor: "Editor",
        manager: "Manager",
        unknownWithCode: "Unknown ({code})",
        noDataAvailable: "No data available.",
        noDataExtracted: "No data extracted.",
        noExtractionRunsYet: "No extraction runs yet.",
        targetThumbnail: "Target thumbnail",
        profileThumbnailAlt: "Profile thumbnail",
        groupThumbnailAlt: "Group thumbnail",
        mobilePhone: "Mobile phone",
        phone: "Phone",
        homePhone: "Home phone",
        website: "Website",
        email: "Email",
        contactsAndSocials: "Contacts & socials",
        relationshipAndFamily: "Relationship & family",
        relationsTitle: "Relations",
        relativesTitle: "Relatives",
        educationAndWork: "Education & work",
        personalAndBio: "Personal & bio",
        accountPermissions: "Account & permissions",
        relationshipStatus: "Relationship status",
        partnerId: "Partner ID",
        partnerName: "Partner name",
        enrichFamily: "Enrich family",
        addresses: "Addresses",
        address: "Address",
        locationsMap: "Locations (map)",
        markers: "Markers",
        contact: "contact",
        addressLegend: "address",
        placeLegend: "place",
        counters: "Counters",
        noCountersAvailable: "No counters available.",
        activeStatus: "Active",
        closedStatus: "Closed",
        friendStatus: "Friend",
        notFriendStatus: "Not friend",
        memberStatusShort: "Member",
        notMemberStatusShort: "Not member",
        openUserDetails: "Open user details",
        openItem: "Open item",
        communityLabel: "Community",
        partner: "Partner",
        user: "User",
        profiles: "Profiles",
        pagesCommunities: "Pages / Communities",
        capOnItems: "Cap on ({count} items)",
        capOffFullCoverage: "Cap off (full coverage)",
        stopAfterCurrentBatchFinishes: "Stop after the current batch finishes",
        stopEnrichment: "Stop enrichment",
        stopRequestedBatchThenHalt: "Stop requested. The current batch will finish, then enrichment will halt.",
        enrichmentStopped: "Enrichment stopped.",
        linkChartNotLoaded: "vis-network is not loaded. Rebuild the extension and reload the report.",
        linkChartInitFailed: "Link chart failed to initialise (vis-network). Check console for details.",
        observedLinkChartInitFailed: "Observed link chart failed to initialise (vis-network).",
        allProfileFieldsRaw: "All profile fields (raw)",
        showProfileObject: "Show profile object",
        userId: "User ID",
        name: "Name",
        domain: "Domain",
        nickname: "Nickname",
        maidenName: "Maiden name",
        statusLabel: "Status",
        sex: "Sex",
        birthdate: "Birthdate",
        homeTown: "Home town",
        city: "City",
        country: "Country",
        online: "Online",
        lastSeen: "Last seen",
        profileClosed: "Profile closed",
        deactivatedLabel: "Deactivated",
        commonFriends: "Common friends",
        timezone: "Timezone",
        hasMobile: "Has mobile",
        canSeeAllPosts: "Can see all posts",
        canSeeAudio: "Can see audio",
        canWritePrivateMessage: "Can write private message",
        relationshipPartner: "Relationship partner",
        occupationReference: "Occupation reference",
        groupId: "Group ID",
        screenName: "Screen name",
        members: "Members",
        site: "Site",
        role: "Role",
        linkToProfile: "Link to profile",
        linkToCommunity: "Link to community",
        reEnrichShort: "Re-enrich",
        enrichShort: "Enrich",
        stopEnrichmentForLabel: "Stop {label} enrichment",
        enrichLabel: "Enrich {label}",
        engagementEnrichmentPhotos: "Engagement enrichment (photos)",
        engagementEnrichmentVideos: "Engagement enrichment (videos)",
        useCapQuickTriage: "Use a cap for quick triage. Disable cap for full coverage (slower; more rate-limit exposure). You can stop the run anytime from the global enrichment bar.",
        noReturnedPrivateForLabel: "This target returned zero {label}, or the list is private.",
        approximateGeoViewportHint: "City/country values are geocoded to an approximate point. Zoom in to filter the list to your current viewport. Users without a location are shown only when zoomed out.",
        unknownDetailKind: "Unknown detail kind.",
        notResolvedYetGroupsGetById: "Not resolved yet. Click Enrich to run groups.getById.",
        enrichmentCapsSummary: "Enrichment caps: items={items}, likers/item={likers}, commenters/item={commenters}",
        capturedEngagementSummary: "Captured: {likes} likes • {reposts} reposts • {comments} comments • {unique} unique",
        repostsLabel: "Reposts",
        apply: "Apply",
        both: "Both",
        commentsOnly: "Comments only",
        likesOnly: "Likes only",
        allActors: "All actors",
        repeatActorsOnly: "Repeat actors only",
        wallAttachmentLink: "Link",
        documentLabel: "Document",
        pollLabel: "Poll",
        optionsLabel: "options",
        votesLabel: "votes",
        geoLabel: "Geo",
        wallViewPosts: "Posts",
        wallViewEngagement: "Engagement",
        wallViewActors: "Actors",
        showActivity: "Show activity",
        hideActivity: "Hide activity",
        wallPostLabel: "Wall post #{id}",
        noEngagementsRecordedForUserYetCurrentCaps: "No engagements recorded for this user yet (within current caps).",
        repostedPost: "Reposted post",
        repostedContentNoText: "Reposted content has no direct text body.",
        originalSource: "Original source",
        attachmentOnlyPost: "Attachment-only post",
        noOutboundDomainsDetected: "No outbound domains detected in captured posts.",
        seenCountTimes: "Seen {count} times",
        noActorsCapturedSnapshot: "No actors captured in this snapshot.",
        noWallActorsMatchSearch: "No wall actors match your search.",
        noWallActorsMatchCurrentSearch: "No wall actors match the current search.",
        actorNotFoundWallSnapshot: "Actor not found in this wall snapshot.",
        noEvidenceCapturedForActor: "No evidence captured for this actor.",
        noEvidenceCapturedCurrentSourceView: "No evidence captured for this actor in the current source view.",
        selectInteractorToViewEvidence: "Select an interactor to view evidence.",
        interactionsLabel: "Interactions",
        evidenceLabel: "Evidence",
        firstSeenLabel: "First seen",
        lastSeenLabel: "Last seen",
        postsCapturedSummary: "Posts captured",
        likesAcrossPostsSummary: "Likes across posts",
        commentsAcrossPostsSummary: "Comments across posts",
        observedActorsSummary: "Observed actors",
        postRecencyTitle: "Post recency",
        postsPerDaySnapshotWindow: "Posts per day across the captured snapshot window",
        topPostsByLikes: "Top posts by likes",
        topPostsByComments: "Top posts by comments",
        clickRowJumpFullPost: "Click a row to jump to the full post detail view",
        outboundLinkDomains: "Outbound link domains",
        outboundLinkDomainsHint: "Useful for quick OSINT pivots from captured links",
        topInteractors: "Top interactors",
        clickRowOpenWallActors: "Click a row to open the Wall Actors view",
        commentLikesLabel: "Comment likes",
        commentLabel: "Comment",
        noUserResolvedYetUsersGet: "Not resolved yet. Click Enrich to run users.get.",
        likesDeniedCommentsDeniedHelp: "“Likes denied” means the item could not be queried via API. “Comments denied” means likes were captured but comments were blocked.",
        rerunEnrichmentPhotos: "Re-run enrichment (photos)",
        enrichPhotosSlow: "Enrich photos engagement (slow)",
        rerunEnrichmentVideos: "Re-run enrichment (videos)",
        enrichVideosSlow: "Enrich videos engagement (slow)",
        autoContinue: "Auto-continue",
        useItemCap: "Use item cap",
        maxItems: "Max items",
        defaultCap: "Default (200)",
        notEnrichedYet: "Not enriched yet.",
        progressCount: "Progress: {done}/{total}",
        likesDeniedCount: "likes denied: {count}",
        commentsDeniedCount: "comments denied: {count}",
        completeLower: "complete",
        noVideoEngagementYet: "No video engagement enrichment yet. Open the report (interactive) and click Enrich videos engagement.",
        exports: "Exports",
        gephiReadyNote: "CSV outputs are Gephi-ready (nodes + edges). GEXF opens directly in Gephi.",
        profileExportSection: "Profile",
        profileNodesCsv: "Profile nodes (CSV)",
        profileGraphGexf: "Profile graph (GEXF)",
        resolvedExportSection: "Resolved",
        relationsExportSection: "Relations",
        friendsMembersExportSection: "Friends/Members",
        resolvedNodesCsv: "Resolved nodes (CSV)",
        resolvedGraphGexf: "Resolved graph (GEXF)",
        relationsNodesCsv: "Relations nodes (CSV)",
        relationsEdgesCsv: "Relations edges (CSV)",
        relationsGraphGexf: "Relations graph (GEXF)",
        friendsNodesCsv: "Friends/Members nodes (CSV)",
        friendsEdgesCsv: "Friends/Members edges (CSV)",
        friendsGraphGexf: "Friends/Members graph (GEXF)",
        mapLoading: "Loading map…",
        geocoding: "Geocoding…",
        followingLocationsMap: "Following locations (map)",
        followingLocationsHint: "Mapped from followed profiles/pages with a resolvable city/country.",
        followersLocationsMap: "Followers locations (map)",
        followersLocationsHint: "Mapped from followers with a resolvable city/country.",
        communitiesLocationsMap: "Communities locations (map)",
        communitiesLocationsHint: "Mapped from communities with a resolvable city/country.",
        followersOnlyUserProfiles: "Followers are only available for user profiles.",
        storyPreviewAlt: "Story preview",
        storyLabel: "Story",
        noPostsCaptured: "No posts captured.",
        actorsJson: "Actors JSON",
        actorsCsv: "Actors CSV",
        giftThumbnailAlt: "Gift thumbnail",
        senderAlt: "Sender",
        anonymousHidden: "Anonymous / hidden",
        fromIdLabel: "From ID",
        unknownLabel: "Unknown",
        storiesUnavailableDenied: "Stories were not available for this target (or access was denied).",
        giftsUnavailableDenied: "Gifts were not available for this target (or access was denied).",
        showError: "Show error",
        followingGraphSection: "Following",
        communitiesGraphSection: "Communities",
        nodesCsv: "Nodes CSV",
        edgesCsv: "Edges CSV",
        graphGexf: "Graph GEXF",
        followingNodesCsv: "Following nodes (CSV)",
        followingEdgesCsv: "Following edges (CSV)",
        followingGraphGexf: "Following graph (GEXF)",
        communitiesNodesCsv: "Communities nodes (CSV)",
        communitiesEdgesCsv: "Communities edges (CSV)",
        communitiesGraphGexf: "Communities graph (GEXF)",
        wallPhotosAlbum: "Wall photos",
        photosWithYouAlbum: "Photos with you",
        clearLocationFilter: "Clear location filter",
        zoomInToFilterPhotoCards: "Zoom in to filter the visible photo cards to the current viewport.",
        photoLocation: "Photo location",
        noPhotoCardsAvailableToFilter: "No photo cards are available to filter.",
        showingPhotoCardsViewport: "Showing {shown}/{total}. Zoom in to filter photo cards by the current viewport.",
        filteredPhotoCardsViewport: "Filtered to viewport: {shown}/{total} shown • geotagged: {located}",
        interactiveOfflineGroupOverviewMap: "Interactive offline group overview map",
        interactiveOfflineRelationsMap: "Interactive offline relations map",
        interactiveOfflineFriendsMap: "Interactive offline friends map",
        interactiveOfflineFollowingMap: "Interactive offline following map",
        interactiveOfflineFollowersMap: "Interactive offline followers map",
        interactiveOfflineCommunitiesMap: "Interactive offline communities map",
        interactiveOfflineObservedMap: "Interactive offline observed map",
        locationFilterActivePosts: "Location filter active: {count} posts matched this place",
        noLocationPostsExcluded: " • {count} no-location posts excluded",
        showingMappedWallPointsPackagedSnapshot: "Showing {count} mapped wall points for the packaged wall snapshot. Click a marker to filter wall posts by place.",
        showingViewportUnknown: "Showing {shown}/{total}. Zoom in to filter by viewport (unknown: {unknown}).",
        filteredViewportUnknown: "Filtered to viewport: {shown}/{total} shown (unknown hidden).",
        noBundleLoaded: "No bundle loaded.",
        noEnrichmentDataYetForScope: "No enrichment data yet for this scope.",
        notEnrichedForThisItemYet: "Not enriched for this item yet. Click ⚡ Enrich on the card.",
        noEnrichmentDataYet: "No enrichment data yet.",
        reEnrichUser: "Re-enrich user",
        enrichUser: "Enrich user",
        userResolved: "User resolved.",
        groupResolved: "Group resolved.",
        noUserIdsInCurrentList: "No user IDs in the current list.",
        enrichedListUsers: "Enriched list users.",
        runWallSnapshotFirst: "Run Wall Snapshot first.",
        observedActorsEnriched: "Observed actors enriched. Users: {users} • communities: {communities}",
        noPhotosVisibleDownload: "No photos with downloadable URLs are visible in this report section.",
        couldNotLocateAlbumBlock: "Could not locate the album block.",
        noPhotosFoundInAlbum: "No photos with downloadable URLs were found in this album.",
        photoDownloadsRequested: "Photo downloads requested: {requested} • skipped existing: {skipped}",
        albumPhotoDownloadsRequested: "Album photo downloads requested: {requested} • skipped existing: {skipped}",
        photoDownloadRequested: "Photo download requested in Downloads/vkXtract.",
        repostedPill: "Reposted",
        commentedTimes: "Commented ×{count}",
        noActionsPill: "No actions",
        lastCommentLabel: "Last comment",
        engagersCaptured: "Engagers (captured)",
        reactionLike: "Reaction: Like",
        reactionRepost: "Reaction: Repost",
        commentsCountLabel: "Comments: {count}",
        noEngagersCapturedDenied: "No engagers captured (or access denied).",
        likesSample: "Likes (sample)",
        noLikeDetailCapturedDenied: "No like detail captured (or access denied).",
        repostsSample: "Reposts (sample)",
        noRepostDetailCapturedDenied: "No repost detail captured (or access denied).",
        commentsThreaded: "Comments (threaded)",
        viewImage: "View image",
        viewVideo: "View video",
        linkToImage: "Link to image",
        linkToVideo: "Link to video",
        commentLikesInline: "comment likes",
        commentsRepliesCappedSummary: "Showing {shown}/{total} comments/replies (capped for readability).",
        noCommentDetailCapturedDenied: "No comment detail captured (or access denied).",
        mediaLabel: "Media",
        visNetworkNotAvailableSnapshot: "vis-network not available in snapshot.",
        noMediaEngagementMapFound: "No media engagement map found.",
        notEnoughDataGenerateChart: "Not enough data yet. Enrich engagement first, then generate the chart.",
        noEdgesFoundEnrichMore: "No edges found for current top users/media. Enrich more items.",
        mediaCardNotFoundCurrentView: "Media card not found in the current report view.",
        noLikesInTopWindow: "No likes captured in the current top window.",
        wallLocationsTitle: "Wall locations",
        wallLocationsSub: "Filtered wall posts with coordinates or tagged places. Marker click opens the post in the Wall feed.",
        searchWallTextPlaceholder: "Search wall text, hashtags, mentions, domains…",
        searchWallActorsPlaceholder: "Search wall actors…",
        selectActorToViewEngagementEvidence: "Select an actor to view engagement evidence.",
        observedIntroTitle: "Observed",
        observedIntroSub: "Observed is an interaction-derived set built from captured Wall / Photo / Video engagement. It is evidence-backed and useful for surfacing repeat interactors when full friends/member lists are incomplete, denied, or less informative. It is not a full friends/member list.",
        observedNetworkTitle: "Observed Network",
        observedNetworkSub: "Grid view mirrors Friends/Members while preserving interaction evidence and source-aware filtering.",
        enrichObserved: "Enrich",
        networkVisualisationTitle: "Network visualisation",
        networkVisualisationSub: "Observed chart and map share the same shell. The chart is wall-interaction only; the map plots available location fields from observed entities.",
        loadingObservedChart: "Loading observed chart…",
        mapIdle: "Map idle.",
        observedCoverageTitle: "Observed Network coverage",
        observedChartScope: "Observed chart scope",
        wallPostsOnlyObservedChart: "Wall posts only. This chart is built only from captured wall reactions and wall comments/replies.",
        observedChartActionsHint: "Single click selects a node and highlights neighbours. Right click opens a menu (Open details / Open external / Enrich where relevant). Click an edge label to view evidence.",
        repliesTimesLabel: "Replies ×N",
        commentLikeReactionsNotCaptured: "Comment-like reactions are not currently captured by the Wall snapshot model.",
        observedActorsShowingSummary: "Showing {shown} of {total} observed actors",
        modeLabel: "Mode",
        minInteractionsLabel: "Min interactions",
        noObservedActorsMatchCurrentFilters: "No observed actors match the current filters.",
        wallSnapshotTitle: "Wall Snapshot",
        derivedFromLatestCapturedWallPosts: "Derived from latest {count} captured wall posts",
        latestPostsRequestedCaptured: "Latest {requested} posts requested • Captured {captured}",
        commentsMetric: "Comments {count}",
        likesMetric: "Likes {count}",
        includesMetric: "Includes: {value}",
        postsOnly: "posts only",
        includesComments: "comments",
        includesLikes: "likes",
        actorsMetric: "Actors {count}",
        evidenceMetric: "Evidence {count}",
        observedCoverageCaveat: "Observed Network is interaction-derived and is not a full friends/members list.",
        observedChartNodeActionsHint: "Single click selects a node. Double click opens details / media. Right click opens the context menu.",
        observedPostLabel: "Observed post #{id}",
        openInWall: "Open in Wall",
        observedLinkChartBuilding: "Building observed link chart…",
        observedLinkChartBuildFailed: "Observed link chart failed to build.",
        capturedFromWallSnapshotEvidence: "Captured from Wall Snapshot evidence.",
        capturedFromApiEnrichment: "Captured from VK API enrichment.",
        wallCoverageCaveat: "Wall Snapshot is bounded to the captured snapshot scope and is not a full wall history.",
        denialsLine: "Denials: {comments} posts (comments) • {likes} posts (likes)",
        important: "Important",
        recommendedPackage: "Recommended package",
        recommendedPackageSub: "Report HTML, runtime assets, chart/map data, and raw JSON sidecars.",
        preparingPackageSummary: "Preparing package summary…",
        advanced: "Advanced",
        includeRawJsonSidecars: "Include raw JSON sidecars",
        includeRawJsonSidecarsSub: "Writes the captured bundle and per-run JSON files into the package for audit, re-checking, and downstream analysis.",
        photoEvidence: "Photo evidence",
        noPackagedPhotos: "No packaged photos",
        noPackagedPhotosSub: "Keeps the package lighter and excludes photo copies from the export.",
        includeReferencedPhotos: "Include report-referenced photos",
        includeReferencedPhotosSub: "Packages only photo items that are currently referenced by the report views/cards. This is based on the extracted report content, not on whether you previously clicked one-off photo download buttons. If the current report references zero matching photos, photo copies are skipped automatically.",
        includeAllPhotos: "Include all captured photos",
        includeAllPhotosSub: "Packages every captured photo item returned by the extraction runs that has a usable image URL, whether or not it is currently surfaced in the visible report view.",
        includeSelectedAlbums: "Include selected albums",
        includeSelectedAlbumsSub: "Packages only the photos belonging to the albums you tick below that have usable image URLs. If no albums are selected, photo copies are skipped.",
        chooseAlbums: "Choose one or more albums.",
        videoEvidence: "Video / clip evidence",
        noPackagedVideoEvidence: "No packaged video evidence",
        noPackagedVideoEvidenceSub: "Skips poster/manifests for videos and clips to keep the package smaller.",
        includeReferencedVideoEvidence: "Include report-referenced video/clip posters + manifests",
        includeReferencedVideoEvidenceSub: "Packages the poster images and manifest records for the video/clip evidence already used by the report.",
        includeAllVideoEvidence: "Include all captured video/clip posters + manifests",
        includeAllVideoEvidenceSub: "Packages poster/manifests for the full captured video/clip set, not just the currently surfaced report subset.",
        output: "Output",
        folderPackage: "Folder package",
        folderPackageSub: "Writes the full package tree into Downloads as individual files and folders.",
        zipPackage: "ZIP package",
        zipPackageSub: "Internally assembles the package archive and downloads one final ZIP into Downloads. Extract it first, then open report/index.html from the extracted folder.",
        videoPackagingNote: "Video/clip packaging currently bundles posters + manifests only. The current bundle does not yet store direct video file URLs for true offline binaries.",
        photoVideoIndependentNote: "Photo and Video / clip packaging are independent. Changing the photo option does not disable video poster packaging. If you want to isolate photo packaging during testing, set Video / clip evidence to No packaged video evidence.",
        folderZipNote: "Folder export remains available as the transparent source-of-truth export. ZIP export uses the same package contents but should be extracted before opening the offline report.",
        cancel: "Cancel",
        cancelExport: "Cancel export",
        cancelZipExport: "Cancel ZIP export",
        cancellingExport: "Cancelling export…",
        cancellingZipExport: "Cancelling ZIP export…",
        openExportedPackageFolder: "Open exported package folder",
        showExportedZipInDownloads: "Show exported ZIP in Downloads",
        preparingZipExport: "Preparing ZIP export…",
        idle: "Idle",
        zipPackageSaved: "ZIP package saved to Downloads/{filename}. Extract it, then open report/index.html from the extracted folder.",
        zipExportCancelled: "ZIP export cancelled.",
        zipExportFailedRetry: "ZIP export failed. Switched output back to Folder package so you can retry.",
        zipExportFailedRetryDetailed: "ZIP export failed. {error} Photo and Video / clip packaging are independent; a video poster fetch can fail the ZIP even when you were testing a photo mode. Switched output back to Folder package so you can retry.",
        none: "None",
        allCaptured: "All captured",
        referenced: "Referenced",
        selectedAlbumsCount: "Selected albums ({count})",
        zipPackageExtractBeforeUse: "ZIP package • extract before use",
        rawSidecarsSummary: "Raw sidecars",
        photoEvidenceSummary: "Photo evidence",
        videoClipEvidenceSummary: "Video / clip evidence",
        outputSummary: "Output",
        excluded: "Excluded",
        filesCount: "{count} files",
        itemsCountShort: "{count} item(s)",
        showExportedPackageInDownloads: "Show exported package in Downloads",
        exportPackage: "Export package",
        preparingExport: "Preparing export…",
        downloadAllPhotos: "Download all photos",
        downloadAllVisiblePhotosSub: "Download all visible photos into the photo export folders.",
        downloadAlbum: "Download album",
        unsorted: "Unsorted",
        album: "Album {id}",
        invalidId: "Invalid ID.",
        groupDetails: "Group details",
        primary: "Primary",
        university: "University",
        faculty: "Faculty",
        graduation: "Graduation",
        universities: "Universities",
        schools: "Schools",
        occupation: "Occupation",
        type: "Type",
        career: "Career",
        military: "Military",
        political: "Political",
        religion: "Religion",
        inspiredBy: "Inspired by",
        lifeMain: "Life main",
        peopleMain: "People main",
        smoking: "Smoking",
        alcohol: "Alcohol",
        languages: "Languages",
        about: "About",
        activities: "Activities",
        interests: "Interests",
        music: "Music",
        movies: "Movies",
        tv: "TV",
        books: "Books",
        games: "Games",
        quotes: "Quotes",
        personal: "Personal",
        interestsBio: "Interests & bio",
        activity: "Activity",
        clear: "Clear",
        comments: "Comments",
        likes: "Likes",
        ok: "OK",
        error: "Error",
        done: "Done",
        ageLimits: "Age limits",
        publicLabel: "Public label",
        startDate: "Start date",
        finishDate: "Finish date",
        canPost: "Can post",
        canMessage: "Can message",
        isMember: "Is member",
        memberStatus: "Member status",
        wikiPage: "Wiki page",
        place: "Place",
        description: "Description",
        contacts: "Contacts",
        links: "Links",
        link: "Link",
        yes: "Yes",
        no: "No",
        vkSearch: "VK search",
        cityId: "City ID {id}",
        postInteractionEvidence: "Post Interaction Evidence",
        photoInteractionEvidence: "Photo Interaction Evidence",
        videoInteractionEvidence: "Video Interaction Evidence",
        noVkPageUrlAvailable: "No VK page URL is available.",
        noVkPageUrlAvailableRunExtraction: "No VK page URL is available. Run an extraction from a VK page first.",
        noObservedIdsAvailableToEnrich: "No observed IDs available to enrich.",
        noFamilyGraphDataYet: "No family graph data is available yet.",
        familyTreeIntro: "Target-centric family tree. Solid edges are direct from VK. Dashed edges are inferred from enriched relatives.",
        targetLegend: "target",
        directFamilyLegend: "direct family",
        inferredFamilyLegend: "inferred family",
        extendedFamilyTitle: "Extended family",
        clickFamilyNodeToInspect: "Click a family node to inspect it.",
        familyMemberFallback: "Family member",
        familyDirect: "direct",
        familyInferred: "inferred",
        familyEnrichUserOnly: "Family enrichment is available for user targets only.",
        noFamilyEnrichIds: "No partner/relative IDs are available for family enrichment.",
        familyEnrichRequested: "Requested family enrich for {direct} direct relative(s){extendedPart}.",
        familyEnrichExtendedPart: " + {count} extended candidate(s)",
        familyTreeNotLoaded: "vis-network is not loaded. Rebuild the extension and reload the report.",
        noObservedChartWallPosts: "No wall snapshot posts are available for the Observed chart.",
        noObservedActorsChart: "No observed actors are available for the chart.",
        clearTimeFilter: "Clear time filter",
        timelineFilterTitle: "Timeline filter",
        timelineFilterHint: "Mousewheel to zoom between Years / Months / Days. Click bars to toggle, Shift-click for contiguous range, or drag across bars to select a span.",
        timeLabel: "Time",
        timeBucketSingular: "bucket",
        timeBucketPlural: "buckets",
        locationLabel: "Location",
        nearbyCountSuffix: "(+{count} nearby)",
        searchLabel: "Search",
        selectedPlace: "Selected place",
        zoomLabel: "Zoom: {value}",
        timelineZoomYears: "Years",
        timelineZoomMonths: "Months",
        timelineZoomDays: "Days",
        selectedBucketsSummary: "Selected {count} {bucketLabel} bucket{suffix} • {posts} posts in time filter",
        noTimeFilterSelectedSummary: "No time filter selected • Full captured date span shown",
        titlePostsCount: "{label} • {count} posts",
        showingMatchingPosts: "Showing {shown} of {total} matching posts",
        showingFilteredPosts: "Showing {shown} of {total} filtered posts",
        noPostsMatchCurrentWallFilters: "No posts match the current wall filters.",
        loadMorePosts: "Load more posts",
        showingPostsProgress: "Showing {shown} of {total} posts.",
        showingAllPosts: "Showing all {total} posts.",
        wallReactionsLikes: "Reactions / likes",
        wallCommentsReplies: "Comments / replies",
        wallLikesDeniedPost: "Likes were denied/unavailable for this post.",
        wallNoLikeDetailPost: "No like detail captured for this post.",
        wallShowingCapturedLikerSubset: "Showing captured liker subset ({count}).",
        wallCommentsDeniedPost: "Comments were denied/disabled for this post.",
        wallNoCommentDetailPost: "No comment detail captured for this post.",
        wallShowingCapturedCommentSubset: "Showing captured comment subset ({count}).",
        photoEngagementLinkChartLive: "Photo engagement link chart (live)",
        videoEngagementLinkChartLive: "Video engagement link chart (live)",
        linkChartActionsLabel: "Actions:",
        linkChartActionsHint: "Single click selects a node and highlights neighbours. Right click opens a menu (Open details / Open external / Enrich). Click-and-hold (Move: On) drags nodes. Click an edge label to view evidence.",
        linkChartFocus: "Focus",
        linkChartFocusOn: "Focus: On",
        linkChartFocusOff: "Focus: Off",
        linkChartLayoutRadial: "Layout: Radial",
        linkChartLayoutBipartite: "Layout: Bipartite",
        linkChartMove: "Move",
        linkChartMoveOn: "Move: On",
        linkChartMoveOff: "Move: Off",
        linkChartDepth1: "Depth: 1",
        linkChartDepth2: "Depth: 2",
        neighbourhoodHighlighting: "Neighbourhood highlighting",
        layoutMode: "Layout mode",
        dragNodes: "Drag nodes",
        fitCenterView: "Fit / center view",
        fit: "Fit",
        zoomOut: "Zoom out",
        zoomIn: "Zoom in",
        clearSelection: "Clear selection",
        noDatedPostsTimeline: "No dated posts are available for timeline filtering.",
        noDatedPostsRecency: "No dated posts available for recency view.",
        noPostsAvailable: "No posts available.",
        noRecencyDataYet: "No recency data is available yet.",
        locationFilterPostsMatched: "Location filter active: {count} posts matched this place.",
        locationExcludedCurrentScope: "{count} posts in the current time scope have no location data and are excluded.",
        geocodingWallPlaces: "Geocoding {done}/{total} wall place{suffix}…",
        noCachedWallPlaceHitsYet: "No cached wall place hits yet ({count} recently no-hit).",
        showingViewportUnknownLive: "Showing {shown}/{total}. Zoom in to filter by viewport (unknown: {unknown}).",
        filteredViewportUnknownLive: "Filtered to viewport: {shown}/{total} shown (unknown hidden).",
        noNewLocationsToGeocode: "No new locations to geocode ({count} recently no-hit; retry later or force).",
        geocodingLocations: "Geocoding {done}/{total} locations…",
        geocodingLocationStep: "Geocoding {done}/{total}: {query}",
        geocodingCompleteCachedZoomPan: "Geocoding complete. Zoom/pan to filter (cached locally).",
        geocodingSkippedRecentNoHit: "Geocoding skipped ({count} recently no-hit).",
        mappedGroupOverviewPoints: "Showing {count} mapped group overview points.",
        noGroupOverviewLocationsAvailable: "No group overview locations are available yet.",
        showingViewportLive: "Showing {shown}/{total}. Zoom in to filter by viewport.",
        filteredViewportLive: "Filtered to viewport: {shown}/{total} shown.",
        geocodingCompleteCached: "Geocoding complete (cached locally).",
        geocodingStartedCached: "Geocoding started (cached locally).",
        noCapturedPhotoAlbumsInBundle: "No captured photo albums are available in this bundle.",
        noImageUrlAvailable: "No image URL available.",
        noEmbeddablePlayerReturned: "No embeddable player URL was returned for this item.",
        noEmbeddablePlayerOrPosterReturned: "No embeddable player URL or poster was returned for this item."
      },
      empty: {
        noProfileDataYet: "No profile data yet. Click Extract Profile/Group in the extension.",
        profileResponseEmpty: "Profile response was empty.",
        noPhotosExtractedYet: "No photos extracted yet. Click Extract Photos.",
        noPhotosReturnedDenied: "No photos returned, or access was denied.",
        noVideosExtractedYet: "No videos extracted yet. Click Extract Videos.",
        noVideosReturnedDenied: "No videos returned, or access was denied.",
        noStoriesExtractedYet: "No stories extracted yet. Click Extract Stories.",
        noStoryItemsReturned: "No story items returned.",
        noFollowingExtractedYet: "No following extracted yet. Click Extract Following (user profiles only).",
        noSubscriptionsReturnedDenied: "No subscriptions returned, or access was denied.",
        noFollowersExtractedYet: "No followers extracted yet. Click Extract Followers (user profiles only).",
        noFollowersReturnedDenied: "No followers returned, or access was denied.",
        noCommunitiesExtractedYet: "No communities extracted yet. Click Extract Communities (user profiles only).",
        noCommunitiesReturnedDenied: "No communities returned, or access was denied.",
        noGiftsExtractedYet: "No gifts extracted yet. Click Extract Gifts (user profiles only).",
        noGiftsReturnedDenied: "No gifts returned, or access was denied.",
        noWallSnapshotYet: "No wall snapshot captured yet.",
        wallInteractiveLoading: "Wall snapshot captured. Interactive wall view is loading…",
        noObservedYet: "No observed network yet.",
        observedInteractiveLoading: "Observed network captured. Interactive observed view is loading…"
      }
    }
  };

  // src/i18n/uk.ts
  var uk = {
    popup: {
      locale: {
        english: "English",
        ukrainian: "Українська"
      },
      intro: "Керований процес вилучення даних VK для поточної цілі. Дані зберігаються локально, формується звіт для аналітичної роботи, а стан активного вилучення залишається видимим після повторного відкриття popup.",
      labels: {
        currentVkPage: "Поточна сторінка VK",
        target: "Ціль",
        lastAction: "Остання дія",
        status: "Статус",
        case: "Справа",
        kind: "Тип",
        runs: "Запуски",
        accessToken: "Токен доступу",
        activeExtraction: "АКТИВНЕ ВИЛУЧЕННЯ",
        state: "Стан",
        active: "Активне завдання",
        stage: "Етап",
        started: "Розпочато",
        queue: "Черга"
      },
      buttons: {
        rescan: "Оновити контекст",
        reloadTab: "Перезавантажити вкладку",
        clearBusy: "Скинути стан зайнятості",
        save: "Зберегти",
        clear: "Очистити",
        run: "Виконати",
        exportRawJson: "Експортувати raw JSON",
        openReport: "Відкрити звіт",
        resetCurrentTarget: "Скинути поточну ціль",
        refreshList: "Оновити список",
        deleteCurrent: "Видалити поточне",
        deleteAll: "Видалити все",
        buildObservedFromWall: "Сформувати мережу Observed зі знімка стіни"
      },
      workflow: {
        profileNetworkTitle: "Профіль і мережа",
        profileNetworkHint: "Ідентифікація, контекст цілі, друзі/учасники, підписники, підписки, спільноти.",
        mediaCollectionTitle: "Збір медіа",
        mediaCollectionHint: "Фото, відео, історії та подарунки, якщо доступні.",
        wallSnapshotTitle: "Знімок стіни та результати",
        wallSnapshotHint: "Формування Observed, відстеження збору коментарів/лайків, експорт і відкриття звіту."
      },
      tasks: {
        profile: "Профіль / Група",
        friends: "Друзі / Учасники",
        followers: "Підписники",
        following: "Підписки",
        communities: "Спільноти",
        wall: "Знімок стіни / формування Observed",
        photos: "Фото",
        videos: "Відео",
        stories: "Історії",
        gifts: "Подарунки"
      },
      wall: {
        posts: "Пости",
        comments: "Коментарі",
        likes: "Лайки",
        maxPosts: "Макс. кількість постів",
        include: "Включити",
        rangeMode: "Режим діапазону",
        dateTimeRange: "діапазон дати/часу",
        from: "Від",
        to: "До",
        snapshotRangeFull: "Діапазон знімка: уся доступна історія стіни.",
        snapshotRangeCustom: "Діапазон знімка: увімкнено власний режим дати/часу.",
        snapshotRangeFrom: "Діапазон знімка: від {value}",
        snapshotRangeTo: "Діапазон знімка: до {value}",
        snapshotRangeBetween: "Діапазон знімка: {from} → {to}"
      },
      finish: {
        title: "Перегляд, експорт і керування збереженими справами",
        hint: "Відкрийте live-звіт, експортуйте raw JSON, скиньте поточну ціль або керуйте збереженими даними в IndexedDB.",
        storageTitle: "Керування сховищем",
        storageHint: "Зберігається окремо для кожної цілі (користувач 123, група -123). Видаляйте старі цілі, якщо обсяг даних з часом збільшується."
      },
      footer: {
        notes: "Примітки: Частина даних VK може бути приватною. Якщо API-виклик повертає “access denied”, це нормально. Для великих цілей потрібен час — vkXtract глобально розподіляє API-виклики VK, щоб зменшити блокування, а Wall працює у форматі Snapshot (ви задаєте максимальну кількість постів).",
        legal: "Правові умови"
      },
      runtime: {
        ready: "Готово",
        idle: "Бездіяльність",
        notLoaded: "Не завантажено",
        storedLocally: "Збережено локально",
        savedLocallyForReuse: "Збережено локально для повторного використання між цілями.",
        pasteOrReplaceToken: "Вставте або замініть VK access_token",
        pasteToken: "Вставте VK access_token",
        tokenSaved: "Токен збережено",
        noTokenLoaded: "Токен не завантажено!",
        openVkTargetToEnable: "Відкрийте сторінку користувача або спільноти VK, щоб увімкнути вилучення.",
        openVkTargetToRescan: "Відкрийте сторінку користувача або спільноти VK, щоб оновити контекст popup.",
        working: "Виконується…",
        starting: "Запуск…",
        waiting: "Очікування",
        off: "Вимкнено",
        complete: "Завершено",
        blocked: "Заблоковано",
        disabled: "Вимкнено",
        unknown: "Невідомо",
        currentTargetReset: "Поточну ціль скинуто.",
        vkTabReloaded: "Вкладку VK перезавантажено",
        loading: "Завантаження…",
        storageListFailed: "Не вдалося завантажити список сховища.",
        noStoredTargetsYet: "Збережених цілей ще немає. Виконайте вилучення профілю, щоб створити запис.",
        targetsStoredSummary: "Збережено цілей: {total} (показано {shown}) • Орієнтовний обсяг: {size}",
        runsUpdatedSummary: "{kind} {key} • запусків: {runs} • оновлено: {updated}",
        deleteStoredConfirm: "Видалити збережені дані для цілі {key}?",
        deletedTarget: "Ціль {key} видалено.",
        queuedTask: "Додано в чергу: {task}",
        sessionBusy: "Зайнято ({reason})",
        buildObservedFallbackHint: "Використовує зібрані взаємодії зі стіни, коли список друзів/учасників приватний, обмежений або неповний.",
        notAvailableForCommunityTargets: "Недоступно для цілей типу спільнота.",
        notAvailableForThisTargetType: "Недоступно для цього типу цілі.",
        running: "Виконується",
        done: "Завершено",
        error: "Помилка",
        active: "Активне",
        busyLockCleared: "Стан зайнятості скинуто",
        tokenCleared: "Токен очищено",
        profileExtracted: "Профіль / групу вилучено.",
        friendsExtracted: "Список друзів / учасників вилучено.",
        followersExtracted: "Підписників вилучено.",
        followingExtracted: "Підписки вилучено.",
        communitiesExtracted: "Спільноти вилучено.",
        photosExtracted: "Фото вилучено.",
        videosExtracted: "Відео вилучено.",
        storiesExtracted: "Історії вилучено.",
        giftsExtracted: "Подарунки вилучено.",
        wallExtracted: "Знімок стіни вилучено.",
        requestFailed: "Запит не виконано",
        ok: "Гаразд",
        deletedCurrentTargetData: "Дані поточної цілі видалено.",
        deletedAllStoredData: "Усі збережені дані vkXtract видалено.",
        deleteCurrentTargetConfirm: "Видалити всі збережені дані для ПОТОЧНОЇ цілі?",
        deleteAllTargetsConfirm: "Видалити ВСІ збережені цілі vkXtract? Цю дію неможливо скасувати.",
        storiesExtractedIfAvailable: "Історії вилучено (якщо доступні).",
        giftsExtractedIfAvailable: "Подарунки вилучено (якщо доступні).",
        delete: "Видалити",
        collectedSuffix: "вилучено: {count}",
        noActiveTab: "Немає активної вкладки",
        notOnVk: "Не на сторінці VK",
        unknownError: "Невідома помилка",
        authorizationFailed: "Помилка авторизації (недійсний / прострочений токен)",
        tooManyRequests: "Забагато запитів за секунду (ліміт частоти)",
        permissionDenied: "Доступ заборонено",
        accessDenied: "Доступ відхилено",
        userDeletedBanned: "Користувача видалено / заблоковано",
        groupAccessDenied: "Доступ до групи відхилено",
        profilePrivate: "Профіль приватний",
        vkError: "Помилка VK {code}",
        busyGeneric: "зайнято"
      }
    },
    report: {
      shell: {
        title: "Звіт vkXtract",
        snapshotTitle: "Знімок звіту vkXtract",
        loading: "Завантаження звіту…",
        building: "Формування звіту…"
      },
      enrichBar: {
        title: "Виконується збагачення",
        hint: "Зупинення доступне з будь-якого місця у звіті.",
        running: "Виконується…",
        photos: "Фото",
        videos: "Відео",
        friends: "Друзі",
        following: "Підписки",
        followers: "Підписники",
        communities: "Спільноти",
        stopPhoto: "Зупинити збагачення фото",
        stopVideo: "Зупинити збагачення відео",
        stopFriends: "Зупинити збагачення друзів",
        stopFollowing: "Зупинити збагачення підписок",
        stopFollowers: "Зупинити збагачення підписників",
        stopCommunities: "Зупинити збагачення спільнот",
        stopAll: "Зупинити все збагачення"
      },
      tabs: {
        overview: "Огляд",
        observed: "Observed",
        wall: "Стіна",
        following: "Підписки",
        followers: "Підписники",
        communities: "Спільноти",
        photos: "Фото",
        videos: "Відео",
        stories: "Історії",
        gifts: "Подарунки",
        rawJson: "Raw JSON",
        runs: "Запуски"
      },
      common: {
        exportCasePackage: "Експортувати пакет справи",
        notAvailableForGroupExtractions: "Недоступно для вилучення з груп.",
        generatedLocallyFooter: "Локально сформовано у vkXtract. Вкладки нижче узагальнюють вилучені дані; повне захоплення збережено в Raw JSON.",
        rawJsonTitle: "Raw JSON",
        rawJsonSub: "Повний пакет захоплених даних (схема: {schema})",
        target: "Ціль",
        targetDisplayName: "Відображуване ім’я цілі",
        dateTimeRetrieved: "Дата й час отримання",
        targetUrl: "URL цілі",
        showRawResponse: "Показати raw response",
        capturedAt: "Отримано: {value}",
        showingOfTotal: "Показано {shown}{totalPart}{cappedPart}",
        totalPart: " із {total}",
        cappedPart: " (обмежено)",
        clipsIncluded: " • Кліпи: {count} (включено нижче)",
        itemsCount: "Елементи: {count}",
        profilesPagesTotal: "Профілі: {profiles} • Сторінки: {pages}{totalPart}{cappedPart}",
        totalOnly: " • Усього: {total}",
        sourceLabel: " • Джерело: {value}.",
        sourceShort: "Джерело",
        sourceUserGet: "user.get",
        sourceFriendsGet: "friends.get",
        sourceGroupsGetMembers: "groups.getMembers",
        sourceUnresolved: "не збагачено",
        photoShort: "фото",
        videoShort: "відео",
        geocodedPlace: "геокодоване місце",
        linkEvidence: "Доказ зв’язку",
        likedPill: "Лайк",
        copiedPill: "Копія",
        commentsCaptured: "Зафіксовані коментарі",
        repliesLabel: "Відповіді",
        poster: "Постер",
        noThumbnail: "Немає мініатюри",
        mousewheelToZoom: "Коліщатко миші для масштабування",
        openExternal: "Відкрити зовні",
        resetZoom: "Скинути масштаб",
        close: "Закрити",
        zoom: "Масштаб",
        player: "Програвач",
        reset: "Скинути",
        hq: "HQ",
        openDetails: "Відкрити деталі",
        lightboxHint: "Коліщатко миші для масштабу • Перетягування для панорамування • Подвійне натискання для скидання",
        showDetails: "Показати деталі",
        linkToMedia: "Посилання на медіа",
        offlineCopyRecorded: "Офлайн-копію для цього елемента вже зафіксовано",
        videoOfflineNotEnabled: "Фактичне офлайн-копіювання для відео/кліпів наразі не увімкнено, оскільки поточний пакет зберігає URL програвача/мініатюри, а не прямий URL медіафайлу.",
        reEnrichThisMedia: "Повторно збагатити цей медіаелемент",
        enrichThisMedia: "Збагатити цей медіаелемент",
        exportPackageTitle: "Експортувати пакет справи",
        exportPackageSub: "Побудова пакета у форматі folder-first для офлайн-перегляду. Після розпакування у власну структуру папок експорт є самодостатнім.",
        extractionRunsTitle: "Запуски вилучення",
        newestFirst: "Спочатку найновіші.",
        clipsTitle: "Кліпи",
        clipsMergedSub: "Для зручності аналітичної роботи кліпи об’єднано з Відео. Вони залишаються візуально окремими в цьому розділі, але більше не потребують окремої вкладки.",
        clipsSeeTab: " • Кліпи: {count} (див. вкладку Кліпи)",
        photoThumbnailAlt: "Мініатюра фото",
        clipThumbnailAlt: "Мініатюра кліпу",
        videoThumbnailAlt: "Мініатюра відео",
        photoOfflineRecorded: "Офлайн-копію для цього фото вже зафіксовано",
        makePhotoOfflineCopy: "Створити офлайн-копію (фото)",
        reEnrich: "Повторно збагатити",
        enrich: "Збагатити",
        idLabel: "ID",
        dateLabel: "Дата",
        latLngLabel: "Lat/Lng",
        durationLabel: "Тривалість",
        viewsLabel: "Перегляди",
        likesLabel: "Лайки",
        uniqueLabel: "Унікальні",
        periodDay: "День",
        periodWeek: "Тиждень",
        periodMonth: "Місяць",
        periodYear: "Рік",
        reactionsLikesTab: "Реакції (лайки)",
        combinedTab: "Комбіновано",
        overlapTab: "Перетин",
        hotspotsTab: "Хотспоти",
        recencyTab: "Давність",
        engagementTitle: "Взаємодія",
        engagementAnalysisPhotos: "Аналіз взаємодії (фото)",
        engagementAnalysisVideos: "Аналіз взаємодії (відео)",
        topEngager: "Топ інтерактор",
        noEngagersCapturedYet: "Інтеракторів ще не зафіксовано.",
        rawCapturedSamples: "Сирі зафіксовані вибірки",
        engagementIfEnriched: "Взаємодія (якщо збагачено)",
        notEnoughObservedChartEvidence: "Ще недостатньо доказових даних взаємодій стіни, щоб побудувати графік Observed.",
        capLabel: "ліміт",
        noItemCap: "без ліміту елементів",
        analysisProgressNote: "Аналіз оновлюється під час збагачення і наразі відображає {processed} оброблених елементів ({capText}).",
        noActionsCaptured: "Дій не зафіксовано",
        noCommentTextCapturedForEdge: "Текст коментаря для цього ребра не зафіксовано.",
        repostCopyAction: "Репост/копія",
        repostAction: "Репост",
        commentTimes: "Коментар ×{count}",
        replyTimes: "Відповідь ×{count}",
        noTextLabel: "(без тексту)",
        enrichThisUser: "Збагатити цього користувача",
        familyRoleTarget: "Ціль",
        familyRolePartner: "Партнер",
        familyRoleParent: "Батько/мати",
        familyRoleChild: "Дитина",
        familyRoleGrandparent: "Дідусь/бабуся",
        familyRoleGrandchild: "Онук/онука",
        familyRoleSibling: "Брат/сестра",
        familyRoleRelative: "Родич",
        familyRoleAuntUncle: "Тітка / дядько",
        familyRoleNieceNephew: "Племінник / племінниця",
        familyRoleCousin: "Двоюрідний родич",
        photoGeolocationMap: "Геолокація фото (карта)",
        photoGeolocationHint: "Піни з’являються для будь-якого фото з lat/lng. Якщо для цього фото доступне збагачення взаємодії, його буде показано в панелі деталей.",
        hotspotTitle: "Точка активності",
        details: "Деталі",
        noHotspotDataForPhotos: "Немає даних про точки активності для фото.",
        noHotspotDataForVideos: "Немає даних про точки активності для відео.",
        hotspotAlt: "Точка активності",
        requestParams: "Параметри запиту",
        responseLabel: "Відповідь",
        profilePhotosAlbum: "Фото профілю",
        savedPhotosAlbum: "Збережені фото",
        allVideosAlbum: "Усі відео",
        attachmentLabel: "Вкладення",
        photoLabel: "Фото",
        videoLabel: "Відео",
        mediaGenericLabel: "Медіа",
        showingMappedWallPostsCurrentScope: "Показано {count} постів стіни з координатами для поточного часово́го фільтра{locationPart}{excludedPart}.",
        locationMatchesPart: " • збігів за місцем: {count}",
        noMappedWallPostsCurrentScope: "Для поточного часово́го фільтра ще немає відповідних постів стіни з координатами.",
        reportLoaderPreparing: "Підготовка…",
        reportLoaderLoadingBundle: "Завантаження bundle…",
        reportLoaderRenderingReport: "Рендеринг звіту…",
        reportLoaderFinalising: "Завершення…",
        observedLinkChartToastNotLoaded: "Не вдалося побудувати графік Observed: vis-network не завантажено",
        observedLinkChartToastInitError: "Не вдалося побудувати графік Observed: помилка ініціалізації vis-network",
        notAvailableForThisExtraction: "Недоступно для цього вилучення.",
        enrichedOneItem: "Збагачено 1 елемент.",
        noMediaItemsFoundAlbumBlock: "У цьому блоці альбому медіаелементів не знайдено.",
        enrichedAlbumBatchUpToFive: "Збагачено пакет альбому (до 5 елементів).",
        noOverlapUsersYet: "Користувачів із перетином ще немає.",
        usersWhoBothLikeAndComment: "Користувачі, які і лайкають, і коментують: {count}.",
        noPhotoEngagementYet: "Збагачення взаємодії з фото ще не виконано. Відкрийте звіт (interactive) і натисніть Enrich photos engagement.",
        noClipsReturnedForTarget: "Для цієї цілі кліпи не повернуто.",
        capturedMeta: "Отримано: {value}",
        noPartnerRelativesReturned: "Партнера/родичів не повернуто або доступ був обмежений.",
        education: "Освіта",
        noEducationDataReturned: "Дані про освіту не повернуто.",
        workService: "Робота і служба",
        noCareerMilitaryDataReturned: "Дані про кар’єру / військову службу не повернуто.",
        noLabelExtractedYet: "{label} ще не вилучено. Натисніть Extract Friends/Members.",
        noFollowedProfilesReturned: "Профілі, на які підписанося, не повернуто.",
        noFollowedPagesCommunitiesReturned: "Сторінки/спільноти, на які підписанося, не повернуто.",
        profilePrivate: "Профіль приватний",
        profileOpen: "Профіль відкритий",
        verified: "Верифіковано",
        openGroup: "Відкрита група",
        closedGroup: "Закрита група",
        privateGroup: "Приватна група",
        notSpecified: "Не вказано",
        noAgeLimit: "Без вікових обмежень",
        notMemberLong: "Не учасник",
        notSure: "Не визначено",
        declinedInvitation: "Запрошення відхилено",
        requestSent: "Запит надіслано",
        invited: "Запрошено",
        female: "Жіноча",
        male: "Чоловіча",
        friendStatusValueNotFriends: "Не друзі",
        friendStatusValueIncomingRequest: "Вхідний запит",
        friendStatusValueOutgoingRequest: "Вихідний запит",
        friendStatusValueFriends: "Друзі",
        occupationTypeWork: "Робота",
        occupationTypeSchool: "Школа",
        occupationTypeUniversity: "Університет",
        politicalCommunist: "Комуністичні",
        politicalSocialist: "Соціалістичні",
        politicalModerate: "Помірковані",
        politicalLiberal: "Ліберальні",
        politicalConservative: "Консервативні",
        politicalMonarchist: "Монархічні",
        politicalUltraconservative: "Ультраконсервативні",
        politicalApathetic: "Байдужі",
        politicalLibertarian: "Лібертаріанські",
        peopleIntellectCreativity: "Інтелект і творчість",
        peopleKindnessHonesty: "Доброта і чесність",
        peopleHealthBeauty: "Здоров’я і краса",
        peopleWealthPower: "Багатство і влада",
        peopleCouragePersistence: "Сміливість і наполегливість",
        peopleHumorLife: "Гумор і любов до життя",
        lifeFamilyChildren: "Сім’я і діти",
        lifeCareerMoney: "Кар’єра і гроші",
        lifeEntertainmentLeisure: "Розваги і дозвілля",
        lifeScienceResearch: "Наука і дослідження",
        lifeImprovingWorld: "Покращення світу",
        lifePersonalDevelopment: "Саморозвиток",
        lifeBeautyArt: "Краса і мистецтво",
        lifeFameInfluence: "Слава і вплив",
        stanceVeryNegative: "Дуже негативно",
        stanceNegative: "Негативно",
        stanceNeutral: "Нейтрально",
        stanceCompromisable: "Компромісно",
        stancePositive: "Позитивно",
        relationSingle: "Неодружений/незаміжня",
        relationInRelationship: "У стосунках",
        relationEngaged: "Заручений/заручена",
        relationMarried: "Одружений/заміжня",
        relationComplicated: "Усе складно",
        relationActivelySearching: "У активному пошуку",
        relationInLove: "Закоханий/закохана",
        relationCivilUnion: "У цивільному шлюбі",
        communityAdministrator: "Адміністратор спільноти",
        administrator: "Адміністратор",
        moderator: "Модератор",
        editor: "Редактор",
        manager: "Керівник",
        unknownWithCode: "Невідомо ({code})",
        noDataAvailable: "Дані відсутні.",
        noDataExtracted: "Дані не вилучено.",
        noExtractionRunsYet: "Запусків вилучення ще немає.",
        targetThumbnail: "Мініатюра цілі",
        profileThumbnailAlt: "Мініатюра профілю",
        groupThumbnailAlt: "Мініатюра групи",
        mobilePhone: "Мобільний телефон",
        phone: "Телефон",
        homePhone: "Домашній телефон",
        website: "Вебсайт",
        email: "Електронна пошта",
        contactsAndSocials: "Контакти й соцмережі",
        relationshipAndFamily: "Стосунки та родина",
        relationsTitle: "Стосунки",
        relativesTitle: "Родичі",
        educationAndWork: "Освіта і робота",
        personalAndBio: "Особисте і біо",
        accountPermissions: "Акаунт і дозволи",
        relationshipStatus: "Статус стосунків",
        partnerId: "ID партнера",
        partnerName: "Ім’я партнера",
        enrichFamily: "Збагатити родину",
        addresses: "Адреси",
        address: "Адреса",
        locationsMap: "Локації (карта)",
        markers: "Маркери",
        contact: "контакт",
        addressLegend: "адреса",
        placeLegend: "місце",
        counters: "Лічильники",
        noCountersAvailable: "Лічильники відсутні.",
        activeStatus: "Активний",
        closedStatus: "Закритий",
        friendStatus: "Друг",
        notFriendStatus: "Не друг",
        memberStatusShort: "Учасник",
        notMemberStatusShort: "Не учасник",
        openUserDetails: "Відкрити деталі користувача",
        openItem: "Відкрити елемент",
        communityLabel: "Спільнота",
        partner: "Партнер",
        user: "Користувач",
        profiles: "Профілі",
        pagesCommunities: "Сторінки / спільноти",
        capOnItems: "Ліміт увімкнено ({count} ел.)",
        capOffFullCoverage: "Ліміт вимкнено (повне охоплення)",
        stopAfterCurrentBatchFinishes: "Зупинити після завершення поточного пакета",
        stopEnrichment: "Зупинити збагачення",
        stopRequestedBatchThenHalt: "Запит на зупинку прийнято. Поточний пакет завершиться, після чого збагачення зупиниться.",
        enrichmentStopped: "Збагачення зупинено.",
        linkChartNotLoaded: "vis-network не завантажено. Перезберіть розширення й перезавантажте звіт.",
        linkChartInitFailed: "Не вдалося ініціалізувати графік зв’язків (vis-network). Перевірте консоль.",
        observedLinkChartInitFailed: "Не вдалося ініціалізувати графік Observed (vis-network).",
        allProfileFieldsRaw: "Усі поля профілю (raw)",
        showProfileObject: "Показати об’єкт профілю",
        userId: "ID користувача",
        name: "Ім’я",
        domain: "Домен",
        nickname: "Псевдонім",
        maidenName: "Дівоче прізвище",
        statusLabel: "Статус",
        sex: "Стать",
        birthdate: "Дата народження",
        homeTown: "Рідне місто",
        city: "Місто",
        country: "Країна",
        online: "Онлайн",
        lastSeen: "Остання активність",
        profileClosed: "Профіль закрито",
        deactivatedLabel: "Деактивовано",
        commonFriends: "Спільні друзі",
        timezone: "Часовий пояс",
        hasMobile: "Має мобільний",
        canSeeAllPosts: "Може бачити всі пости",
        canSeeAudio: "Може бачити аудіо",
        canWritePrivateMessage: "Може писати приватні повідомлення",
        relationshipPartner: "Партнер у стосунках",
        occupationReference: "Посилання на зайнятість",
        groupId: "ID групи",
        screenName: "Screen name",
        members: "Учасники",
        site: "Сайт",
        role: "Роль",
        linkToProfile: "Посилання на профіль",
        linkToCommunity: "Посилання на спільноту",
        reEnrichShort: "Повторно збагатити",
        enrichShort: "Збагатити",
        stopEnrichmentForLabel: "Зупинити збагачення: {label}",
        enrichLabel: "Збагатити: {label}",
        engagementEnrichmentPhotos: "Збагачення взаємодії (фото)",
        engagementEnrichmentVideos: "Збагачення взаємодії (відео)",
        useCapQuickTriage: "Використовуйте ліміт для швидкого тріажу. Вимкніть ліміт для повного охоплення (повільніше; вищий ризик rate-limit). Запуск можна зупинити будь-коли через глобальну панель збагачення.",
        noReturnedPrivateForLabel: "Ціль повернула нуль елементів для {label}, або список є приватним.",
        approximateGeoViewportHint: "Значення міста/країни геокодуються до приблизної точки. Збільшіть масштаб, щоб відфільтрувати список за поточним вікном карти. Користувачі без локації показуються лише при віддаленні.",
        unknownDetailKind: "Невідомий тип деталей.",
        notResolvedYetGroupsGetById: "Ще не збагачено. Натисніть Enrich, щоб запустити groups.getById.",
        enrichmentCapsSummary: "Ліміти збагачення: items={items}, likers/item={likers}, commenters/item={commenters}",
        capturedEngagementSummary: "Отримано: {likes} лайків • {reposts} репостів • {comments} коментарів • {unique} унікальних",
        repostsLabel: "Репости",
        apply: "Застосувати",
        both: "Обидва",
        commentsOnly: "Лише коментарі",
        likesOnly: "Лише лайки",
        allActors: "Усі актори",
        repeatActorsOnly: "Лише повторні актори",
        wallAttachmentLink: "Посилання",
        documentLabel: "Документ",
        pollLabel: "Опитування",
        optionsLabel: "варіантів",
        votesLabel: "голосів",
        geoLabel: "Гео",
        wallViewPosts: "Пости",
        wallViewEngagement: "Взаємодія",
        wallViewActors: "Актори",
        showActivity: "Показати активність",
        hideActivity: "Приховати активність",
        wallPostLabel: "Wall пост #{id}",
        noEngagementsRecordedForUserYetCurrentCaps: "Для цього користувача ще не зафіксовано взаємодій (у межах поточних лімітів).",
        repostedPost: "Репостнутий пост",
        repostedContentNoText: "Репостнутий вміст не має прямого текстового тіла.",
        originalSource: "Початкове джерело",
        attachmentOnlyPost: "Пост лише з вкладенням",
        noOutboundDomainsDetected: "У зафіксованих постах не виявлено вихідних доменів.",
        seenCountTimes: "Зафіксовано {count} раз(ів)",
        noActorsCapturedSnapshot: "У цьому snapshot акторів не зафіксовано.",
        noWallActorsMatchSearch: "Жоден wall actor не відповідає вашому пошуку.",
        noWallActorsMatchCurrentSearch: "Жоден wall actor не відповідає поточному пошуку.",
        actorNotFoundWallSnapshot: "Актор не знайдений у цьому wall snapshot.",
        noEvidenceCapturedForActor: "Для цього актора доказові дані не зафіксовано.",
        noEvidenceCapturedCurrentSourceView: "Для цього актора у поточному джерелі доказові дані не зафіксовано.",
        selectInteractorToViewEvidence: "Виберіть інтерактора, щоб переглянути доказові дані.",
        interactionsLabel: "Взаємодії",
        evidenceLabel: "Доказові дані",
        firstSeenLabel: "Перше спостереження",
        lastSeenLabel: "Останнє спостереження",
        postsCapturedSummary: "Зафіксовано постів",
        likesAcrossPostsSummary: "Лайки по постах",
        commentsAcrossPostsSummary: "Коментарі по постах",
        observedActorsSummary: "Актори Observed",
        postRecencyTitle: "Давність постів",
        postsPerDaySnapshotWindow: "Пости за день у межах зафіксованого вікна snapshot",
        topPostsByLikes: "Топ постів за лайками",
        topPostsByComments: "Топ постів за коментарями",
        clickRowJumpFullPost: "Натисніть рядок, щоб перейти до повного вигляду поста",
        outboundLinkDomains: "Домени вихідних посилань",
        outboundLinkDomainsHint: "Корисно для швидких OSINT pivot по зафіксованих посиланнях",
        topInteractors: "Топ інтеракторів",
        clickRowOpenWallActors: "Натисніть рядок, щоб відкрити вигляд Wall Actors",
        commentLikesLabel: "Лайки коментаря",
        commentLabel: "Коментар",
        noUserResolvedYetUsersGet: "Ще не збагачено. Натисніть Enrich, щоб запустити users.get.",
        likesDeniedCommentsDeniedHelp: "“Likes denied” означає, що елемент не вдалося опитати через API. “Comments denied” означає, що лайки були отримані, але коментарі заблоковані.",
        rerunEnrichmentPhotos: "Повторно запустити збагачення (фото)",
        enrichPhotosSlow: "Збагатити взаємодію фото (повільно)",
        rerunEnrichmentVideos: "Повторно запустити збагачення (відео)",
        enrichVideosSlow: "Збагатити взаємодію відео (повільно)",
        autoContinue: "Автопродовження",
        useItemCap: "Використовувати ліміт елементів",
        maxItems: "Макс. елементів",
        defaultCap: "Типово (200)",
        notEnrichedYet: "Ще не збагачено.",
        progressCount: "Прогрес: {done}/{total}",
        likesDeniedCount: "лайків відхилено: {count}",
        commentsDeniedCount: "коментарів відхилено: {count}",
        completeLower: "завершено",
        noVideoEngagementYet: "Збагачення взаємодії з відео ще не виконано. Відкрийте звіт (interactive) і натисніть Enrich videos engagement.",
        exports: "Експорт",
        gephiReadyNote: "CSV-вивантаження сумісні з Gephi (вузли + ребра). GEXF відкривається безпосередньо в Gephi.",
        profileExportSection: "Профіль",
        profileNodesCsv: "Вузли профілю (CSV)",
        profileGraphGexf: "Граф профілю (GEXF)",
        resolvedExportSection: "Збагачені вузли",
        relationsExportSection: "Зв’язки",
        friendsMembersExportSection: "Друзі/учасники",
        resolvedNodesCsv: "Збагачені вузли (CSV)",
        resolvedGraphGexf: "Граф збагачених вузлів (GEXF)",
        relationsNodesCsv: "Вузли зв’язків (CSV)",
        relationsEdgesCsv: "Ребра зв’язків (CSV)",
        relationsGraphGexf: "Граф зв’язків (GEXF)",
        friendsNodesCsv: "Вузли друзів/учасників (CSV)",
        friendsEdgesCsv: "Ребра друзів/учасників (CSV)",
        friendsGraphGexf: "Граф друзів/учасників (GEXF)",
        mapLoading: "Завантаження карти…",
        geocoding: "Геокодування…",
        followingLocationsMap: "Локації підписок (карта)",
        followingLocationsHint: "Побудовано за підписками на профілі/сторінки з визначуваним містом/країною.",
        followersLocationsMap: "Локації підписників (карта)",
        followersLocationsHint: "Побудовано за підписниками з визначуваним містом/країною.",
        communitiesLocationsMap: "Локації спільнот (карта)",
        communitiesLocationsHint: "Побудовано за спільнотами з визначуваним містом/країною.",
        followersOnlyUserProfiles: "Підписники доступні лише для профілів користувачів.",
        storyPreviewAlt: "Попередній перегляд історії",
        storyLabel: "Історія",
        noPostsCaptured: "Пости не зафіксовано.",
        actorsJson: "Актори JSON",
        actorsCsv: "Актори CSV",
        giftThumbnailAlt: "Мініатюра подарунка",
        senderAlt: "Відправник",
        anonymousHidden: "Анонімно / приховано",
        fromIdLabel: "ID відправника",
        unknownLabel: "Невідомо",
        storiesUnavailableDenied: "Історії були недоступні для цієї цілі (або доступ відхилено).",
        giftsUnavailableDenied: "Подарунки були недоступні для цієї цілі (або доступ відхилено).",
        showError: "Показати помилку",
        followingGraphSection: "Підписки",
        communitiesGraphSection: "Спільноти",
        nodesCsv: "Вузли CSV",
        edgesCsv: "Ребра CSV",
        graphGexf: "Граф GEXF",
        followingNodesCsv: "Вузли підписок (CSV)",
        followingEdgesCsv: "Ребра підписок (CSV)",
        followingGraphGexf: "Граф підписок (GEXF)",
        communitiesNodesCsv: "Вузли спільнот (CSV)",
        communitiesEdgesCsv: "Ребра спільнот (CSV)",
        communitiesGraphGexf: "Граф спільнот (GEXF)",
        wallPhotosAlbum: "Фото зі стіни",
        photosWithYouAlbum: "Фото з вами",
        clearLocationFilter: "Очистити фільтр локації",
        zoomInToFilterPhotoCards: "Збільшіть масштаб, щоб фільтрувати видимі картки фото за поточним вікном карти.",
        photoLocation: "Локація фото",
        noPhotoCardsAvailableToFilter: "Картки фото для фільтрації недоступні.",
        showingPhotoCardsViewport: "Показано {shown}/{total}. Збільшіть масштаб, щоб фільтрувати картки фото за поточним вікном карти.",
        filteredPhotoCardsViewport: "Відфільтровано за вікном карти: показано {shown}/{total} • з геотегом: {located}",
        interactiveOfflineGroupOverviewMap: "Інтерактивна офлайн-карта огляду групи",
        interactiveOfflineRelationsMap: "Інтерактивна офлайн-карта зв’язків",
        interactiveOfflineFriendsMap: "Інтерактивна офлайн-карта друзів",
        interactiveOfflineFollowingMap: "Інтерактивна офлайн-карта підписок",
        interactiveOfflineFollowersMap: "Інтерактивна офлайн-карта підписників",
        interactiveOfflineCommunitiesMap: "Інтерактивна офлайн-карта спільнот",
        interactiveOfflineObservedMap: "Інтерактивна офлайн-карта Observed",
        locationFilterActivePosts: "Активний фільтр локації: {count} постів відповідають цьому місцю",
        noLocationPostsExcluded: " • виключено постів без локації: {count}",
        showingMappedWallPointsPackagedSnapshot: "Показано {count} точок стіни з координатами для упакованого знімка. Натисніть маркер, щоб відфільтрувати пости стіни за місцем.",
        showingViewportUnknown: "Показано {shown}/{total}. Збільшіть масштаб, щоб фільтрувати за вікном карти (невідомих: {unknown}).",
        filteredViewportUnknown: "Відфільтровано за вікном карти: показано {shown}/{total} (невідомі приховано).",
        noBundleLoaded: "Пакет не завантажено.",
        noEnrichmentDataYetForScope: "Даних збагачення для цього розділу ще немає.",
        notEnrichedForThisItemYet: "Цей елемент ще не збагачено. Натисніть ⚡ Enrich на картці.",
        noEnrichmentDataYet: "Даних збагачення ще немає.",
        reEnrichUser: "Повторно збагатити користувача",
        enrichUser: "Збагатити користувача",
        userResolved: "Користувача збагатено.",
        groupResolved: "Групу збагатено.",
        noUserIdsInCurrentList: "У поточному списку немає ID користувачів.",
        enrichedListUsers: "Користувачів зі списку збагатено.",
        runWallSnapshotFirst: "Спочатку запустіть Wall Snapshot.",
        observedActorsEnriched: "Акторів Observed збагатено. Користувачі: {users} • спільноти: {communities}",
        noPhotosVisibleDownload: "У цьому розділі звіту не видно фото з URL для завантаження.",
        couldNotLocateAlbumBlock: "Не вдалося знайти блок альбому.",
        noPhotosFoundInAlbum: "У цьому альбомі не знайдено фото з URL для завантаження.",
        photoDownloadsRequested: "Запитано завантаження фото: {requested} • пропущено наявних: {skipped}",
        albumPhotoDownloadsRequested: "Запитано завантаження фото альбому: {requested} • пропущено наявних: {skipped}",
        photoDownloadRequested: "Запит на завантаження фото надіслано до Downloads/vkXtract.",
        repostedPill: "Репост",
        commentedTimes: "Коментував ×{count}",
        noActionsPill: "Без дій",
        lastCommentLabel: "Останній коментар",
        engagersCaptured: "Інтерактори (зафіксовано)",
        reactionLike: "Реакція: лайк",
        reactionRepost: "Реакція: репост",
        commentsCountLabel: "Коментарі: {count}",
        noEngagersCapturedDenied: "Інтеракторів не зафіксовано (або доступ заборонено).",
        likesSample: "Лайки (вибірка)",
        noLikeDetailCapturedDenied: "Деталі лайків не зафіксовано (або доступ заборонено).",
        repostsSample: "Репости (вибірка)",
        noRepostDetailCapturedDenied: "Деталі репостів не зафіксовано (або доступ заборонено).",
        commentsThreaded: "Коментарі (ланцюжок)",
        viewImage: "Переглянути зображення",
        viewVideo: "Переглянути відео",
        linkToImage: "Посилання на зображення",
        linkToVideo: "Посилання на відео",
        commentLikesInline: "лайки коментаря",
        commentsRepliesCappedSummary: "Показано {shown}/{total} коментарів/відповідей (обмежено для зручності читання).",
        noCommentDetailCapturedDenied: "Деталі коментарів не зафіксовано (або доступ заборонено).",
        mediaLabel: "Медіа",
        visNetworkNotAvailableSnapshot: "vis-network недоступний у snapshot.",
        noMediaEngagementMapFound: "Карту взаємодії медіа не знайдено.",
        notEnoughDataGenerateChart: "Даних ще недостатньо. Спочатку збагатіть взаємодію, а потім згенеруйте графік.",
        noEdgesFoundEnrichMore: "Для поточних top users/media ребер не знайдено. Збагатіть більше елементів.",
        mediaCardNotFoundCurrentView: "Картку медіа не знайдено в поточному вигляді звіту.",
        noLikesInTopWindow: "У поточному верхньому вікні лайки не зафіксовано.",
        wallLocationsTitle: "Локації стіни",
        wallLocationsSub: "Відфільтровані пости стіни з координатами або позначеними місцями. Натискання на маркер відкриває пост у стрічці Wall.",
        searchWallTextPlaceholder: "Пошук по тексту стіни, хештегах, згадках, доменах…",
        searchWallActorsPlaceholder: "Пошук акторів стіни…",
        selectActorToViewEngagementEvidence: "Виберіть актора, щоб переглянути доказові дані взаємодії.",
        observedIntroTitle: "Observed",
        observedIntroSub: "Observed — це набір, похідний від взаємодій, побудований із захоплених даних Wall / Photo / Video engagement. Він спирається на доказові дані й корисний для виявлення повторних взаємодіючих суб’єктів, коли повні списки друзів/учасників неповні, недоступні або менш інформативні. Це не повний список друзів/учасників.",
        observedNetworkTitle: "Мережа Observed",
        observedNetworkSub: "Подання у вигляді сітки повторює Friends/Members, зберігаючи при цьому доказову взаємодію та фільтрацію за джерелами.",
        enrichObserved: "Збагатити",
        networkVisualisationTitle: "Візуалізація мережі",
        networkVisualisationSub: "Графік і карта Observed використовують спільну оболонку. Графік відображає лише взаємодії зі стіною; карта показує доступні поля місцезнаходження для сутностей Observed.",
        loadingObservedChart: "Завантаження графіка Observed…",
        mapIdle: "Карта неактивна.",
        observedCoverageTitle: "Покриття мережі Observed",
        observedChartScope: "Охоплення графіка Observed",
        wallPostsOnlyObservedChart: "Лише пости стіни. Цей графік будується тільки з зафіксованих реакцій стіни та коментарів/відповідей стіни.",
        observedChartActionsHint: "Одинарне натискання вибирає вузол і підсвічує сусідів. Правий клік відкриває меню (Open details / Open external / Enrich where relevant). Натисніть напис на ребрі, щоб переглянути доказові дані.",
        repliesTimesLabel: "Відповіді ×N",
        commentLikeReactionsNotCaptured: "Реакції-лайки на коментарі наразі не фіксуються моделлю Wall snapshot.",
        observedActorsShowingSummary: "Показано {shown} з {total} акторів Observed",
        modeLabel: "Режим",
        minInteractionsLabel: "Мін. взаємодій",
        noObservedActorsMatchCurrentFilters: "Жоден актор Observed не відповідає поточним фільтрам.",
        wallSnapshotTitle: "Знімок стіни",
        derivedFromLatestCapturedWallPosts: "Побудовано з останніх {count} захоплених постів стіни",
        latestPostsRequestedCaptured: "Запитано останні {requested} постів • Захоплено {captured}",
        commentsMetric: "Коментарі {count}",
        likesMetric: "Лайки {count}",
        includesMetric: "Включає: {value}",
        postsOnly: "лише пости",
        includesComments: "коментарі",
        includesLikes: "лайки",
        actorsMetric: "Актори {count}",
        evidenceMetric: "Докази {count}",
        observedCoverageCaveat: "Мережа Observed побудована на основі взаємодій і не є повним списком друзів/учасників.",
        observedChartNodeActionsHint: "Одинарне натискання вибирає вузол. Подвійне натискання відкриває деталі / медіа. Правий клік відкриває контекстне меню.",
        observedPostLabel: "Observed пост #{id}",
        openInWall: "Відкрити у Wall",
        observedLinkChartBuilding: "Побудова графіка Observed…",
        observedLinkChartBuildFailed: "Не вдалося побудувати графік Observed.",
        capturedFromWallSnapshotEvidence: "Захоплено з доказових даних Wall Snapshot.",
        capturedFromApiEnrichment: "Захоплено з VK API під час збагачення.",
        wallCoverageCaveat: "Знімок стіни обмежений межами захопленого знімка і не є повною історією стіни.",
        denialsLine: "Відмови: {comments} постів (коментарі) • {likes} постів (лайки)",
        important: "Важливо",
        recommendedPackage: "Рекомендований пакет",
        recommendedPackageSub: "HTML-звіт, runtime-ресурси, дані графів/карт і raw JSON sidecars.",
        preparingPackageSummary: "Підготовка зведення пакета…",
        advanced: "Додатково",
        includeRawJsonSidecars: "Включити raw JSON sidecars",
        includeRawJsonSidecarsSub: "Записує захоплений пакет і JSON-файли окремих запусків у пакет для аудиту, повторної перевірки та подальшого аналізу.",
        photoEvidence: "Фото-доказові дані",
        noPackagedPhotos: "Без упакованих фото",
        noPackagedPhotosSub: "Робить пакет легшим і виключає копії фото з експорту.",
        includeReferencedPhotos: "Включити фото, на які посилається звіт",
        includeReferencedPhotosSub: "Пакує лише фотоелементи, які зараз використовуються у поданнях/картках звіту. Це базується на вилученому вмісті звіту, а не на тому, чи ви раніше натискали кнопки одноразового завантаження фото. Якщо поточний звіт не посилається на відповідні фото, копії фото автоматично пропускаються.",
        includeAllPhotos: "Включити всі вилучені фото",
        includeAllPhotosSub: "Пакує кожен вилучений фотоелемент, повернутий під час запусків, який має придатний URL зображення, незалежно від того, чи зараз він відображається у видимому поданні звіту.",
        includeSelectedAlbums: "Включити вибрані альбоми",
        includeSelectedAlbumsSub: "Пакує лише фото, що належать до позначених нижче альбомів і мають придатні URL зображень. Якщо альбоми не вибрано, копії фото пропускаються.",
        chooseAlbums: "Виберіть один або кілька альбомів.",
        videoEvidence: "Відео / кліп доказові дані",
        noPackagedVideoEvidence: "Без упакованих відеодоказів",
        noPackagedVideoEvidenceSub: "Пропускає постери/маніфести для відео і кліпів, щоб зменшити розмір пакета.",
        includeReferencedVideoEvidence: "Включити постери + маніфести відео/кліпів, на які посилається звіт",
        includeReferencedVideoEvidenceSub: "Пакує постери й записи маніфестів для відео/кліп доказових даних, які вже використовуються звітом.",
        includeAllVideoEvidence: "Включити постери + маніфести всіх вилучених відео/кліпів",
        includeAllVideoEvidenceSub: "Пакує постери/маніфести для повного набору вилучених відео/кліпів, а не лише для підмножини, що зараз відображається у звіті.",
        output: "Вивід",
        folderPackage: "Пакет-папка",
        folderPackageSub: "Записує повну структуру пакета в Downloads як окремі файли та папки.",
        zipPackage: "ZIP-пакет",
        zipPackageSub: "Внутрішньо збирає архів пакета та завантажує один фінальний ZIP у Downloads. Спочатку розпакуйте його, а потім відкрийте report/index.html з розпакованої папки.",
        videoPackagingNote: "Пакування відео/кліпів наразі включає лише постери + маніфести. Поточний пакет ще не зберігає прямі URL відеофайлів для справжніх офлайн-бінарників.",
        photoVideoIndependentNote: "Пакування фото та відео/кліпів є незалежним. Зміна параметра фото не вимикає пакування відеопостерів. Якщо ви хочете ізолювати пакування фото під час тестування, встановіть для Video / clip evidence значення No packaged video evidence.",
        folderZipNote: "Експорт у папку залишається прозорим експортом-джерелом істини. ZIP-експорт використовує той самий вміст пакета, але його слід розпакувати перед відкриттям офлайн-звіту.",
        cancel: "Скасувати",
        cancelExport: "Скасувати експорт",
        cancelZipExport: "Скасувати ZIP-експорт",
        cancellingExport: "Скасування експорту…",
        cancellingZipExport: "Скасування ZIP-експорту…",
        openExportedPackageFolder: "Відкрити папку експортованого пакета",
        showExportedZipInDownloads: "Показати експортований ZIP у Downloads",
        preparingZipExport: "Підготовка ZIP-експорту…",
        idle: "Очікування",
        zipPackageSaved: "ZIP-пакет збережено в Downloads/{filename}. Розпакуйте його, а потім відкрийте report/index.html з розпакованої папки.",
        zipExportCancelled: "ZIP-експорт скасовано.",
        zipExportFailedRetry: "ZIP-експорт не вдався. Режим виводу повернуто до Folder package, щоб ви могли повторити спробу.",
        zipExportFailedRetryDetailed: "ZIP-експорт не вдався. {error} Пакування фото та відео / кліпів є незалежним; збій отримання постера відео може зірвати ZIP, навіть якщо ви тестували лише режим фото. Режим виводу повернуто до Folder package, щоб ви могли повторити спробу.",
        none: "Немає",
        allCaptured: "Усе захоплене",
        referenced: "За посиланнями",
        selectedAlbumsCount: "Вибрані альбоми ({count})",
        zipPackageExtractBeforeUse: "ZIP-пакет • розпакуйте перед використанням",
        rawSidecarsSummary: "Raw sidecars",
        photoEvidenceSummary: "Фото-доказові дані",
        videoClipEvidenceSummary: "Відео / кліп доказові дані",
        outputSummary: "Вивід",
        excluded: "Виключено",
        filesCount: "{count} файлів",
        itemsCountShort: "{count} ел.",
        showExportedPackageInDownloads: "Показати експортований пакет у Downloads",
        exportPackage: "Експортувати пакет",
        preparingExport: "Підготовка експорту…",
        downloadAllPhotos: "Завантажити всі фото",
        downloadAllVisiblePhotosSub: "Завантажити всі видимі фото до папок експорту фото.",
        downloadAlbum: "Завантажити альбом",
        unsorted: "Без сортування",
        album: "Альбом {id}",
        invalidId: "Некоректний ID.",
        groupDetails: "Деталі групи",
        primary: "Основне",
        university: "Університет",
        faculty: "Факультет",
        graduation: "Випуск",
        universities: "Університети",
        schools: "Школи",
        occupation: "Зайнятість",
        type: "Тип",
        career: "Кар’єра",
        military: "Військова служба",
        political: "Політичні погляди",
        religion: "Релігія",
        inspiredBy: "Натхненний",
        lifeMain: "Головне в житті",
        peopleMain: "Головне в людях",
        smoking: "Ставлення до куріння",
        alcohol: "Ставлення до алкоголю",
        languages: "Мови",
        about: "Про себе",
        activities: "Діяльність",
        interests: "Інтереси",
        music: "Музика",
        movies: "Фільми",
        tv: "ТБ",
        books: "Книги",
        games: "Ігри",
        quotes: "Цитати",
        personal: "Особисте",
        interestsBio: "Інтереси та біо",
        activity: "Активність",
        clear: "Очистити",
        comments: "Коментарі",
        likes: "Лайки",
        ok: "OK",
        error: "Помилка",
        done: "Готово",
        ageLimits: "Вікові обмеження",
        publicLabel: "Публічна мітка",
        startDate: "Дата початку",
        finishDate: "Дата завершення",
        canPost: "Може публікувати",
        canMessage: "Можна написати",
        isMember: "Є учасником",
        memberStatus: "Статус учасника",
        wikiPage: "Wiki-сторінка",
        place: "Місце",
        description: "Опис",
        contacts: "Контакти",
        links: "Посилання",
        link: "Посилання",
        yes: "Так",
        no: "Ні",
        vkSearch: "Пошук VK",
        cityId: "ID міста {id}",
        postInteractionEvidence: "Доказові дані взаємодії з постами",
        photoInteractionEvidence: "Доказові дані взаємодії з фото",
        videoInteractionEvidence: "Доказові дані взаємодії з відео",
        noVkPageUrlAvailable: "URL сторінки VK недоступний.",
        noVkPageUrlAvailableRunExtraction: "URL сторінки VK недоступний. Спочатку запустіть вилучення з сторінки VK.",
        noObservedIdsAvailableToEnrich: "ID Observed для збагачення недоступні.",
        noFamilyGraphDataYet: "Дані для графа родини ще недоступні.",
        familyTreeIntro: "Сімейне дерево, побудоване навколо цілі. Суцільні зв’язки — прямі з VK. Пунктирні — виведені з уже збагачених родичів.",
        targetLegend: "ціль",
        directFamilyLegend: "пряма родина",
        inferredFamilyLegend: "виведена родина",
        extendedFamilyTitle: "Розширена родина",
        clickFamilyNodeToInspect: "Натисніть вузол родини, щоб переглянути деталі.",
        familyMemberFallback: "Член родини",
        familyDirect: "прямий",
        familyInferred: "виведений",
        familyEnrichUserOnly: "Збагачення родини доступне лише для цілей типу користувач.",
        noFamilyEnrichIds: "ID партнера/родичів для збагачення родини недоступні.",
        familyEnrichRequested: "Запитано збагачення родини для {direct} прямих родичів{extendedPart}.",
        familyEnrichExtendedPart: " + {count} розширених кандидатів",
        familyTreeNotLoaded: "vis-network не завантажено. Перезберіть розширення й перезавантажте звіт.",
        noObservedChartWallPosts: "Пости зі знімка стіни для графіка Observed недоступні.",
        noObservedActorsChart: "Актори Observed для графіка недоступні.",
        clearTimeFilter: "Очистити часовий фільтр",
        timelineFilterTitle: "Фільтр часової шкали",
        timelineFilterHint: "Коліщатко миші змінює масштаб між роками / місяцями / днями. Натискайте стовпчики, Shift-натисканням вибирайте суміжний діапазон або перетягуйте по стовпчиках для вибору інтервалу.",
        timeLabel: "Час",
        timeBucketSingular: "сегм.",
        timeBucketPlural: "сегм.",
        locationLabel: "Локація",
        nearbyCountSuffix: "(+{count} поруч)",
        searchLabel: "Пошук",
        selectedPlace: "Вибране місце",
        zoomLabel: "Масштаб: {value}",
        timelineZoomYears: "Роки",
        timelineZoomMonths: "Місяці",
        timelineZoomDays: "Дні",
        selectedBucketsSummary: "Вибрано {count} сегм. {bucketLabel}{suffix} • {posts} постів у часовому фільтрі",
        noTimeFilterSelectedSummary: "Часовий фільтр не вибрано • Показано повний зафіксований діапазон дат",
        titlePostsCount: "{label} • {count} постів",
        showingMatchingPosts: "Показано {shown} з {total} відповідних постів",
        showingFilteredPosts: "Показано {shown} з {total} відфільтрованих постів",
        noPostsMatchCurrentWallFilters: "Жоден пост не відповідає поточним фільтрам стіни.",
        loadMorePosts: "Завантажити більше постів",
        showingPostsProgress: "Показано {shown} з {total} постів.",
        showingAllPosts: "Показано всі {total} постів.",
        wallReactionsLikes: "Реакції / лайки",
        wallCommentsReplies: "Коментарі / відповіді",
        wallLikesDeniedPost: "Лайки для цього поста були недоступні / відхилені.",
        wallNoLikeDetailPost: "Деталі лайків для цього поста не зафіксовано.",
        wallShowingCapturedLikerSubset: "Показано зафіксовану підмножину лайкерів ({count}).",
        wallCommentsDeniedPost: "Коментарі для цього поста були недоступні / вимкнені.",
        wallNoCommentDetailPost: "Деталі коментарів для цього поста не зафіксовано.",
        wallShowingCapturedCommentSubset: "Показано зафіксовану підмножину коментарів ({count}).",
        photoEngagementLinkChartLive: "Графік взаємодії з фото (live)",
        videoEngagementLinkChartLive: "Графік взаємодії з відео (live)",
        linkChartActionsLabel: "Дії:",
        linkChartActionsHint: "Одинарне натискання вибирає вузол і підсвічує сусідів. Правий клік відкриває меню (Open details / Open external / Enrich). Натисніть і утримуйте (Move: On), щоб перетягувати вузли. Натисніть напис на ребрі, щоб переглянути доказові дані.",
        linkChartFocus: "Фокус",
        linkChartFocusOn: "Фокус: Увімк.",
        linkChartFocusOff: "Фокус: Вимк.",
        linkChartLayoutRadial: "Макет: Радіальний",
        linkChartLayoutBipartite: "Макет: Біпартитний",
        linkChartMove: "Рух",
        linkChartMoveOn: "Рух: Увімк.",
        linkChartMoveOff: "Рух: Вимк.",
        linkChartDepth1: "Глибина: 1",
        linkChartDepth2: "Глибина: 2",
        neighbourhoodHighlighting: "Підсвічування сусідніх вузлів",
        layoutMode: "Режим макета",
        dragNodes: "Перетягування вузлів",
        fitCenterView: "Вписати / центрувати вигляд",
        fit: "Вписати",
        zoomOut: "Зменшити",
        zoomIn: "Збільшити",
        clearSelection: "Очистити вибір",
        noDatedPostsTimeline: "Для фільтра часової шкали немає датованих постів.",
        noDatedPostsRecency: "Для подання за давністю немає датованих постів.",
        noPostsAvailable: "Пости недоступні.",
        noRecencyDataYet: "Дані для подання за давністю ще недоступні.",
        locationFilterPostsMatched: "Активний фільтр локації: {count} постів відповідають цьому місцю.",
        locationExcludedCurrentScope: "{count} постів у поточному часовому діапазоні не мають даних про локацію та виключені.",
        geocodingWallPlaces: "Геокодування місць стіни {done}/{total}{suffix}…",
        noCachedWallPlaceHitsYet: "Кешованих збігів місць стіни ще немає ({count} нещодавно без збігів).",
        showingViewportUnknownLive: "Показано {shown}/{total}. Збільшіть масштаб, щоб фільтрувати за вікном карти (невідомих: {unknown}).",
        filteredViewportUnknownLive: "Відфільтровано за вікном карти: показано {shown}/{total} (невідомі приховано).",
        noNewLocationsToGeocode: "Немає нових локацій для геокодування ({count} нещодавно без збігів; повторіть пізніше або примусово).",
        geocodingLocations: "Геокодування локацій {done}/{total}…",
        geocodingLocationStep: "Геокодування {done}/{total}: {query}",
        geocodingCompleteCachedZoomPan: "Геокодування завершено. Масштабуйте/переміщуйте карту для фільтрації (локально кешовано).",
        geocodingSkippedRecentNoHit: "Геокодування пропущено ({count} нещодавно без збігів).",
        mappedGroupOverviewPoints: "Показано {count} нанесених точок на карті огляду групи.",
        noGroupOverviewLocationsAvailable: "Локації для карти огляду групи ще недоступні.",
        showingViewportLive: "Показано {shown}/{total}. Збільшіть масштаб, щоб фільтрувати за вікном карти.",
        filteredViewportLive: "Відфільтровано за вікном карти: показано {shown}/{total}.",
        geocodingCompleteCached: "Геокодування завершено (локально кешовано).",
        geocodingStartedCached: "Геокодування розпочато (локально кешовано).",
        noCapturedPhotoAlbumsInBundle: "У цьому пакеті немає захоплених фотоальбомів.",
        noImageUrlAvailable: "URL зображення недоступний.",
        noEmbeddablePlayerReturned: "URL вбудовуваного програвача для цього елемента не повернуто.",
        noEmbeddablePlayerOrPosterReturned: "Для цього елемента не повернуто URL вбудовуваного програвача або постер."
      },
      empty: {
        noProfileDataYet: "Даних профілю ще немає. Натисніть Extract Profile/Group у розширенні.",
        profileResponseEmpty: "Відповідь профілю була порожньою.",
        noPhotosExtractedYet: "Фото ще не вилучено. Натисніть Extract Photos.",
        noPhotosReturnedDenied: "Фото не повернуто або доступ відхилено.",
        noVideosExtractedYet: "Відео ще не вилучено. Натисніть Extract Videos.",
        noVideosReturnedDenied: "Відео не повернуто або доступ відхилено.",
        noStoriesExtractedYet: "Історії ще не вилучено. Натисніть Extract Stories.",
        noStoryItemsReturned: "Елементи історій не повернуто.",
        noFollowingExtractedYet: "Підписки ще не вилучено. Натисніть Extract Following (лише для профілів користувачів).",
        noSubscriptionsReturnedDenied: "Підписки не повернуто або доступ відхилено.",
        noFollowersExtractedYet: "Підписників ще не вилучено. Натисніть Extract Followers (лише для профілів користувачів).",
        noFollowersReturnedDenied: "Підписників не повернуто або доступ відхилено.",
        noCommunitiesExtractedYet: "Спільноти ще не вилучено. Натисніть Extract Communities (лише для профілів користувачів).",
        noCommunitiesReturnedDenied: "Спільноти не повернуто або доступ відхилено.",
        noGiftsExtractedYet: "Подарунки ще не вилучено. Натисніть Extract Gifts (лише для профілів користувачів).",
        noGiftsReturnedDenied: "Подарунки не повернуто або доступ відхилено.",
        noWallSnapshotYet: "Знімок стіни ще не зафіксовано.",
        wallInteractiveLoading: "Знімок стіни зафіксовано. Інтерактивний перегляд стіни завантажується…",
        noObservedYet: "Мережі Observed ще немає.",
        observedInteractiveLoading: "Мережу Observed зафіксовано. Інтерактивний перегляд Observed завантажується…"
      }
    }
  };

  // src/i18n/index.ts
  var STORAGE_KEY = "vkxtract-popup-locale";
  var dictionaries = { en, uk };
  var currentLocale = "en";
  function getNested(obj, path) {
    return path.split(".").reduce((acc, key) => acc == null ? void 0 : acc[key], obj);
  }
  function loadLocale() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "uk" || raw === "en") currentLocale = raw;
    } catch {
      currentLocale = "en";
    }
    return currentLocale;
  }
  function getLocale() {
    return currentLocale;
  }
  function setLocale(locale) {
    currentLocale = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
    }
  }
  function t(path, vars) {
    let value = getNested(dictionaries[currentLocale], path);
    if (typeof value !== "string") value = getNested(dictionaries.en, path);
    if (typeof value !== "string") return path;
    if (vars && typeof vars === "object") {
      for (const [k, v] of Object.entries(vars)) {
        value = value.replaceAll(`{${k}}`, String(v));
      }
    }
    return value;
  }

  // src/entrypoints/popup/popup.ts
  var $ = (id) => document.getElementById(id);
  var tokenInp = $("token");
  var saveTokenBtn = $("saveToken");
  var clearTokenBtn = $("clearToken");
  var ctxEl = $("ctx");
  var targetEl = $("target");
  var lastEl = $("last");
  var statusEl = $("status");
  var toastEl = $("toast");
  var clearBusyBtn = $("clearBusy");
  var sessionFillEl = $("sessionFill");
  var sessionStateEl = $("sessionState");
  var sessionActiveEl = $("sessionActive");
  var sessionQueueEl = $("sessionQueue");
  var sessionStageEl = $("sessionStage");
  var sessionStartedEl = $("sessionStarted");
  var tokenStatusEl = $("tokenStatus");
  var tokenHintEl = $("tokenHint");
  var caseKeyEl = $("caseKey");
  var targetKindEl = $("targetKind");
  var runsCountEl = $("runsCount");
  var reloadTabBtn = $("reloadTab");
  var statusMirrorEl = $("statusMirror");
  var langSwitchEl = $("langSwitch");
  var openLegalBtn = $("openLegal");
  var refreshBtn = $("refresh");
  var extractProfileBtn = $("extractProfile");
  var extractFriendsBtn = $("extractFriends");
  var extractFollowingBtn = $("extractFollowing");
  var extractFollowersBtn = $("extractFollowers");
  var extractCommunitiesBtn = $("extractCommunities");
  var extractWallBtn = $("extractWall");
  var extractPhotosBtn = $("extractPhotos");
  var extractVideosBtn = $("extractVideos");
  var extractStoriesBtn = $("extractStories");
  var extractGiftsBtn = $("extractGifts");
  var stepProfileNetworkEl = $("stepProfileNetwork");
  var stepMediaEl = $("stepMedia");
  var stepWallExportEl = $("stepWallExport");
  var caretProfileNetworkEl = $("caretProfileNetwork");
  var caretMediaEl = $("caretMedia");
  var caretWallExportEl = $("caretWallExport");
  var wallMiniPostsFillEl = $("wallMiniPostsFill");
  var wallMiniPostsTextEl = $("wallMiniPostsText");
  var wallMiniCommentsFillEl = $("wallMiniCommentsFill");
  var wallMiniCommentsTextEl = $("wallMiniCommentsText");
  var wallMiniLikesFillEl = $("wallMiniLikesFill");
  var wallMiniLikesTextEl = $("wallMiniLikesText");
  var wallMaxPostsInp = $("wallMaxPosts");
  var wallIncCommentsCb = $("wallIncComments");
  var wallIncLikesCb = $("wallIncLikes");
  var wallUseDateRangeCb = $("wallUseDateRange");
  var wallDateFromInp = $("wallDateFrom");
  var wallDateToInp = $("wallDateTo");
  var wallRangeInputsEl = $("wallRangeInputs");
  var wallRangeSummaryEl = $("wallRangeSummary");
  var friendsFallbackWrap = $("friendsFallbackWrap");
  var friendsFallbackWallBtn = $("friendsFallbackWall");
  var exportBtn = $("export");
  var reportBtn = $("report");
  var resetBtn = $("reset");
  var storagePanel = $("storagePanel");
  var storageRefreshBtn = $("storageRefresh");
  var deleteCurrentBtn = $("deleteCurrent");
  var deleteAllBtn = $("deleteAll");
  var storageMetaEl = $("storageMeta");
  var storageListEl = $("storageList");
  var toastTimer = null;
  var taskUi = {
    profile: { key: "profile", btn: extractProfileBtn, fill: $("fill-profile"), text: $("text-profile"), chip: $("chip-profile"), note: $("note-profile"), requires: "target" },
    friends: { key: "friends", btn: extractFriendsBtn, fill: $("fill-friends"), text: $("text-friends"), chip: $("chip-friends"), note: $("note-friends"), requires: "target" },
    followers: { key: "followers", btn: extractFollowersBtn, fill: $("fill-followers"), text: $("text-followers"), chip: $("chip-followers"), note: $("note-followers"), requires: "user" },
    following: { key: "following", btn: extractFollowingBtn, fill: $("fill-following"), text: $("text-following"), chip: $("chip-following"), note: $("note-following"), requires: "user" },
    communities: { key: "communities", btn: extractCommunitiesBtn, fill: $("fill-communities"), text: $("text-communities"), chip: $("chip-communities"), note: $("note-communities"), requires: "user" },
    wall: { key: "wall", btn: extractWallBtn, fill: $("fill-wall"), text: $("text-wall"), chip: $("chip-wall"), note: $("note-wall"), requires: "target" },
    photos: { key: "photos", btn: extractPhotosBtn, fill: $("fill-photos"), text: $("text-photos"), chip: $("chip-photos"), note: $("note-photos"), requires: "target" },
    videos: { key: "videos", btn: extractVideosBtn, fill: $("fill-videos"), text: $("text-videos"), chip: $("chip-videos"), note: $("note-videos"), requires: "target" },
    stories: { key: "stories", btn: extractStoriesBtn, fill: $("fill-stories"), text: $("text-stories"), chip: $("chip-stories"), note: $("note-stories"), requires: "target" },
    gifts: { key: "gifts", btn: extractGiftsBtn, fill: $("fill-gifts"), text: $("text-gifts"), chip: $("chip-gifts"), note: $("note-gifts"), requires: "user" }
  };
  var lastPopupMeta = null;
  var activeTask = null;
  function taskLabelFor(key) {
    const map = {
      profile: t("popup.tasks.profile"),
      friends: t("popup.tasks.friends"),
      followers: t("popup.tasks.followers"),
      following: t("popup.tasks.following"),
      communities: t("popup.tasks.communities"),
      wall: t("popup.tasks.wall"),
      photos: t("popup.tasks.photos"),
      videos: t("popup.tasks.videos"),
      stories: t("popup.tasks.stories"),
      gifts: t("popup.tasks.gifts")
    };
    return map[key] || key;
  }
  function applyPopupI18n() {
    document.documentElement.lang = getLocale();
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      if (!key) return;
      node.textContent = t(key);
    });
    if (tokenInp) {
      tokenInp.placeholder = t("popup.runtime.pasteOrReplaceToken");
    }
    if (langSwitchEl) {
      langSwitchEl.value = getLocale();
      const opts = Array.from(langSwitchEl.options);
      if (opts[0]) opts[0].text = t("popup.locale.english");
      if (opts[1]) opts[1].text = t("popup.locale.ukrainian");
    }
  }
  var taskQueue = [];
  var queueDraining = false;
  function fmtTaskName(key) {
    return taskLabelFor(key);
  }
  function fmtQueueText() {
    if (!taskQueue.length) return "—";
    const names = taskQueue.map((q) => fmtTaskName(q.key));
    if (names.length <= 3) return names.join(" → ");
    return `${names[0]} → ${names[1]} → … (+${names.length - 2})`;
  }
  function updateQueueUI() {
    if (sessionQueueEl) sessionQueueEl.textContent = fmtQueueText();
  }
  var POPUP_STEP_PREFS_KEY = "vkx_popup_step_prefs";
  var popupStepStateTouched = false;
  function stepPrefKey(step) {
    return String(step?.id || "");
  }
  function readStepPrefs() {
    try {
      const raw = localStorage.getItem(POPUP_STEP_PREFS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  function writeStepPrefs(next) {
    try {
      localStorage.setItem(POPUP_STEP_PREFS_KEY, JSON.stringify(next));
    } catch {
    }
  }
  function saveStepPref(step) {
    const key = stepPrefKey(step);
    if (!key || !step) return;
    const prefs = readStepPrefs();
    prefs[key] = !!step.open;
    writeStepPrefs(prefs);
  }
  function getSavedStepPref(step) {
    const key = stepPrefKey(step);
    if (!key) return null;
    const prefs = readStepPrefs();
    return typeof prefs[key] === "boolean" ? prefs[key] : null;
  }
  function syncWorkflowCarets() {
    if (caretProfileNetworkEl) caretProfileNetworkEl.textContent = stepProfileNetworkEl?.open ? "▾" : "▸";
    if (caretMediaEl) caretMediaEl.textContent = stepMediaEl?.open ? "▾" : "▸";
    if (caretWallExportEl) caretWallExportEl.textContent = stepWallExportEl?.open ? "▾" : "▸";
  }
  function setStepOpen(step, open, persist = false) {
    if (!step) return;
    step.open = open;
    if (persist) saveStepPref(step);
    syncWorkflowCarets();
  }
  function getTaskCard(key) {
    return document.querySelector(`.taskCard[data-task="${key}"]`);
  }
  function setTaskDisabledUi(key, disabled) {
    const card = getTaskCard(key);
    if (!card) return;
    if (disabled) card.classList.add("disabled");
    else card.classList.remove("disabled");
  }
  function setMiniLane(fillEl, textEl, mode, valueText, pct) {
    if (fillEl) {
      fillEl.className = "wallMiniFill";
      if (mode === "idle") {
        fillEl.classList.add("idle");
        fillEl.style.width = "0%";
      } else if (mode === "indet") {
        fillEl.classList.add("indet");
        fillEl.style.width = "36%";
      } else {
        const safePct = Math.max(0, Math.min(100, Number(pct || 0)));
        fillEl.style.width = `${safePct.toFixed(1)}%`;
      }
    }
    if (textEl) textEl.textContent = valueText;
  }
  function resetWallMini() {
    setMiniLane(wallMiniPostsFillEl, wallMiniPostsTextEl, "idle", "—");
    setMiniLane(wallMiniCommentsFillEl, wallMiniCommentsTextEl, "idle", "—");
    setMiniLane(wallMiniLikesFillEl, wallMiniLikesTextEl, "idle", "—");
  }
  function parsePair(text) {
    const m = String(text || "").match(/(\d+)\s*\/\s*(\d+)/);
    if (!m) return null;
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b <= 0) return null;
    return { a, b };
  }
  function updateWallMini(meta) {
    if (meta.key !== "wall") return;
    const note = String(meta.note || "").trim();
    const processed = Number(meta.processed ?? 0);
    const total = Number(meta.total ?? 0);
    const hasTotal = Number.isFinite(total) && total > 0;
    if (meta.state === "running") {
      if (hasTotal) {
        const pct = Math.max(0, Math.min(100, processed / total * 100));
        setMiniLane(wallMiniPostsFillEl, wallMiniPostsTextEl, "pct", `${fmtNum(processed)} / ${fmtNum(total)}`, pct);
      } else {
        setMiniLane(wallMiniPostsFillEl, wallMiniPostsTextEl, "indet", fmtNum(processed));
      }
      if (/fetching comments/i.test(note)) {
        setMiniLane(wallMiniCommentsFillEl, wallMiniCommentsTextEl, "indet", t("popup.runtime.starting"));
      } else {
        const commentsMatch = note.match(/comments:\s*(\d+\s*\/\s*\d+)/i);
        const pair = commentsMatch ? parsePair(commentsMatch[1]) : null;
        if (pair) setMiniLane(wallMiniCommentsFillEl, wallMiniCommentsTextEl, "pct", `${pair.a} / ${pair.b}`, pair.a / pair.b * 100);
        else setMiniLane(wallMiniCommentsFillEl, wallMiniCommentsTextEl, "idle", wallIncCommentsCb?.checked ? t("popup.runtime.waiting") : t("popup.runtime.off"));
      }
      if (/fetching likes/i.test(note)) {
        setMiniLane(wallMiniLikesFillEl, wallMiniLikesTextEl, "indet", t("popup.runtime.starting"));
      } else {
        const likesMatch = note.match(/likes:\s*(\d+\s*\/\s*\d+)/i);
        const pair = likesMatch ? parsePair(likesMatch[1]) : null;
        if (pair) setMiniLane(wallMiniLikesFillEl, wallMiniLikesTextEl, "pct", `${pair.a} / ${pair.b}`, pair.a / pair.b * 100);
        else setMiniLane(wallMiniLikesFillEl, wallMiniLikesTextEl, "idle", wallIncLikesCb?.checked ? t("popup.runtime.waiting") : t("popup.runtime.off"));
      }
      return;
    }
    if (meta.state === "done") {
      if (hasTotal) setMiniLane(wallMiniPostsFillEl, wallMiniPostsTextEl, "pct", `${fmtNum(processed)} / ${fmtNum(total)}`, processed / total * 100);
      else setMiniLane(wallMiniPostsFillEl, wallMiniPostsTextEl, "pct", t("popup.runtime.collectedSuffix", { count: fmtNum(processed) }), 100);
      setMiniLane(wallMiniCommentsFillEl, wallMiniCommentsTextEl, wallIncCommentsCb?.checked ? "pct" : "idle", wallIncCommentsCb?.checked ? t("popup.runtime.complete") : t("popup.runtime.off"), wallIncCommentsCb?.checked ? 100 : 0);
      setMiniLane(wallMiniLikesFillEl, wallMiniLikesTextEl, wallIncLikesCb?.checked ? "pct" : "idle", wallIncLikesCb?.checked ? t("popup.runtime.complete") : t("popup.runtime.off"), wallIncLikesCb?.checked ? 100 : 0);
      return;
    }
    if (meta.state === "blocked" || meta.state === "error") {
      setMiniLane(wallMiniPostsFillEl, wallMiniPostsTextEl, "idle", t("popup.runtime.blocked"));
      setMiniLane(wallMiniCommentsFillEl, wallMiniCommentsTextEl, "idle", wallIncCommentsCb?.checked ? t("popup.runtime.blocked") : t("popup.runtime.off"));
      setMiniLane(wallMiniLikesFillEl, wallMiniLikesTextEl, "idle", wallIncLikesCb?.checked ? t("popup.runtime.blocked") : t("popup.runtime.off"));
      return;
    }
    resetWallMini();
  }
  function enqueueTask(item) {
    taskQueue.push(item);
    if (taskQueue.length > 10) taskQueue.splice(0, taskQueue.length - 10);
    updateQueueUI();
    toast("info", t("popup.runtime.queuedTask", { task: fmtTaskName(item.key) }));
    setSession(lastPopupMeta?.busy);
  }
  async function drainQueue() {
    if (queueDraining) return;
    queueDraining = true;
    try {
      while (!activeTask && taskQueue.length) {
        const next = taskQueue.shift();
        updateQueueUI();
        await runTask(next.actionType, next.key, next.pageUrl, next.successMsg, next.payload);
      }
    } finally {
      queueDraining = false;
      updateQueueUI();
      setSession(lastPopupMeta?.busy);
    }
  }
  function kickDrain() {
    setTimeout(() => {
      drainQueue().catch(() => {
      });
    }, 0);
  }
  async function runOrQueue(actionType, key, pageUrl, successMsg, payload) {
    const item = { actionType, key, pageUrl, successMsg, payload };
    if (activeTask || queueDraining || taskQueue.length) {
      enqueueTask(item);
      kickDrain();
      return;
    }
    await runTask(actionType, key, pageUrl, successMsg, payload);
  }
  function fmtBytes(bytes) {
    const b = Number(bytes);
    if (!Number.isFinite(b) || b <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let v = b;
    let i = 0;
    while (v >= 1024 && i < units.length - 1) {
      v /= 1024;
      i++;
    }
    const d = i === 0 ? 0 : v < 10 ? 2 : 1;
    return `${v.toFixed(d)} ${units[i]}`;
  }
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (typeof text === "string") e.textContent = text;
    return e;
  }
  function clearChildren(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }
  function fmtWhen(ts) {
    const n = Number(ts);
    if (!Number.isFinite(n) || n <= 0) return "—";
    try {
      return new Date(n).toLocaleString();
    } catch {
      return String(n);
    }
  }
  function popupCaseKeyFromTarget(t2) {
    if (!t2) return "unknown";
    const owner = typeof t2.ownerId === "number" ? t2.ownerId : t2.kind === "group" && typeof t2.id === "number" ? -Math.abs(t2.id) : t2.kind === "user" && typeof t2.id === "number" ? t2.id : void 0;
    if (typeof owner === "number" && Number.isFinite(owner) && owner !== 0) return String(owner);
    const sn = t2.screenName && String(t2.screenName).trim() ? String(t2.screenName).trim().toLowerCase() : "";
    if (sn) return `sn:${sn}`;
    return "unknown";
  }
  function refreshWallMiniIdleState() {
    const wallMeta = lastPopupMeta?.tasks?.wall;
    if (wallMeta && (wallMeta.state === "running" || wallMeta.state === "done")) {
      updateWallMini({ ...wallMeta, key: "wall" });
      return;
    }
    setMiniLane(wallMiniPostsFillEl, wallMiniPostsTextEl, "idle", "—");
    setMiniLane(wallMiniCommentsFillEl, wallMiniCommentsTextEl, "idle", wallIncCommentsCb?.checked ? t("popup.runtime.waiting") : t("popup.runtime.off"));
    setMiniLane(wallMiniLikesFillEl, wallMiniLikesTextEl, "idle", wallIncLikesCb?.checked ? t("popup.runtime.waiting") : t("popup.runtime.off"));
  }
  function syncWallRangeUi() {
    const enabled = !!wallUseDateRangeCb?.checked;
    if (wallRangeInputsEl) {
      if (enabled) wallRangeInputsEl.classList.remove("disabled");
      else wallRangeInputsEl.classList.add("disabled");
    }
    if (wallDateFromInp) wallDateFromInp.disabled = !enabled;
    if (wallDateToInp) wallDateToInp.disabled = !enabled;
    if (wallRangeSummaryEl) {
      if (!enabled) {
        wallRangeSummaryEl.textContent = t("popup.wall.snapshotRangeFull");
      } else {
        const fromText = String(wallDateFromInp?.value || "").trim();
        const toText = String(wallDateToInp?.value || "").trim();
        if (fromText && toText) {
          wallRangeSummaryEl.textContent = t("popup.wall.snapshotRangeBetween", { from: fromText, to: toText });
        } else if (fromText) {
          wallRangeSummaryEl.textContent = t("popup.wall.snapshotRangeFrom", { value: fromText });
        } else if (toText) {
          wallRangeSummaryEl.textContent = t("popup.wall.snapshotRangeTo", { value: toText });
        } else {
          wallRangeSummaryEl.textContent = t("popup.wall.snapshotRangeCustom");
        }
      }
    }
  }
  function wallRangePayloadPart() {
    const useRange = !!wallUseDateRangeCb?.checked;
    if (!useRange) return { fromTs: 0, toTs: 0 };
    const fromRaw = String(wallDateFromInp?.value || "").trim();
    const toRaw = String(wallDateToInp?.value || "").trim();
    const fromMs = fromRaw ? Date.parse(fromRaw) : NaN;
    const toMs = toRaw ? Date.parse(toRaw) : NaN;
    const fromTs = Number.isFinite(fromMs) && fromMs > 0 ? Math.floor(fromMs / 1e3) : 0;
    const toTs = Number.isFinite(toMs) && toMs > 0 ? Math.floor(toMs / 1e3) : 0;
    if (fromTs && toTs && fromTs > toTs) {
      return { fromTs: toTs, toTs: fromTs };
    }
    return { fromTs, toTs };
  }
  async function refreshStorageList() {
    if (!storageMetaEl || !storageListEl) return;
    try {
      storageMetaEl.textContent = t("popup.runtime.loading");
      clearChildren(storageListEl);
      const r = await sendToBg({ type: "VKX_STORAGE_LIST", limit: 50 });
      if (!r?.ok) throw new Error(r?.error || "storage_list_failed");
      const totalTargets = Number(r.totalTargets ?? 0);
      const totalBytes = Number(r.totalBytes ?? 0);
      const items = Array.isArray(r.items) ? r.items : [];
      storageMetaEl.textContent = t("popup.runtime.targetsStoredSummary", {
        total: totalTargets,
        shown: items.length,
        size: fmtBytes(totalBytes)
      });
      if (!items.length) {
        const empty = el("div", "muted", t("popup.runtime.noStoredTargetsYet"));
        storageListEl.appendChild(empty);
        return;
      }
      for (const it of items) {
        const row = el("div", "storage-item");
        const img = document.createElement("img");
        const photo = String(it.photo || "");
        if (photo) img.src = photo;
        else img.src = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="100%" height="100%" fill="#111827"/><text x="50%" y="55%" text-anchor="middle" font-size="16" fill="#93c5fd">VK</text></svg>');
        img.alt = "";
        row.appendChild(img);
        const meta = el("div", "meta");
        meta.appendChild(el("div", "title", String(it.label || it.key || "—")));
        const sub1 = el("div", "sub");
        sub1.textContent = t("popup.runtime.runsUpdatedSummary", {
          kind: String(it.kind || t("popup.runtime.unknown")),
          key: String(it.key || ""),
          runs: Number(it.runs ?? 0),
          updated: fmtWhen(Number(it.lastUpdatedAt ?? 0))
        });
        meta.appendChild(sub1);
        meta.appendChild(el("div", "sub", `~${fmtBytes(Number(it.approxBytes ?? 0))}`));
        row.appendChild(meta);
        const del = el("button", "danger", t("popup.runtime.delete"));
        del.addEventListener("click", async () => {
          const key = String(it.key || "").trim();
          if (!key) return;
          const ok = window.confirm(t("popup.runtime.deleteStoredConfirm", { key }));
          if (!ok) return;
          del.disabled = true;
          try {
            await sendToBg({ type: "VKX_DELETE_TARGET", key });
            toast("ok", t("popup.runtime.deletedTarget", { key }));
            taskQueue.length = 0;
            updateQueueUI();
          } catch (e) {
            toast("bad", String(e?.message || e));
          } finally {
            del.disabled = false;
            await refreshStorageList();
            await refresh();
          }
        });
        row.appendChild(del);
        storageListEl.appendChild(row);
      }
    } catch (e) {
      storageMetaEl.textContent = t("popup.runtime.storageListFailed");
      const err = el("div", "muted", String(e?.message || e));
      storageListEl.appendChild(err);
    }
  }
  async function getActiveTabId() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab?.id ?? null;
  }
  async function sendToTab(message) {
    const tabId = await getActiveTabId();
    if (!tabId) throw new Error(t("popup.runtime.noActiveTab"));
    return await chrome.tabs.sendMessage(tabId, message);
  }
  async function sendToBg(message) {
    return await chrome.runtime.sendMessage(message);
  }
  function setStatus(text) {
    statusEl.textContent = text;
    if (statusMirrorEl) statusMirrorEl.textContent = text;
  }
  function toast(kind, text) {
    if (toastTimer) window.clearTimeout(toastTimer);
    toastEl.className = `toast ${kind}`;
    toastEl.textContent = text;
    toastEl.style.display = "block";
    toastTimer = window.setTimeout(() => {
      toastEl.style.display = "none";
      toastEl.textContent = "";
    }, 4200);
  }
  function fmtNum(n) {
    const v = Number(n);
    return Number.isFinite(v) ? v.toLocaleString() : "0";
  }
  function vkErrToText(e) {
    if (!e) return t("popup.runtime.unknownError");
    const code = Number(e.code);
    const msg = String(e.msg || "");
    const map = {
      5: t("popup.runtime.authorizationFailed"),
      6: t("popup.runtime.tooManyRequests"),
      7: t("popup.runtime.permissionDenied"),
      15: t("popup.runtime.accessDenied"),
      18: t("popup.runtime.userDeletedBanned"),
      27: t("popup.runtime.groupAccessDenied"),
      30: t("popup.runtime.profilePrivate")
    };
    const head = Number.isFinite(code) && map[code] ? `${map[code]} (VK ${code})` : Number.isFinite(code) ? t("popup.runtime.vkError", { code }) : "VK error";
    return msg ? `${head}: ${msg}` : head;
  }
  function updateFriendsFallback(meta) {
    if (meta.key !== "friends") return;
    if (!friendsFallbackWrap || !friendsFallbackWallBtn) return;
    const code = Number(meta?.error?.code);
    const blocked = meta.ok === false || meta.state === "blocked" || meta.state === "error";
    const show = blocked && ([7, 15, 30].includes(code) || !Number.isFinite(code));
    friendsFallbackWrap.style.display = show ? "block" : "none";
  }
  function setNote(key, text, kind) {
    const note = taskUi[key]?.note;
    if (!note) return;
    const t2 = (text || "").trim();
    if (!t2) {
      note.textContent = "";
      note.className = "taskNote";
      note.style.display = "none";
      return;
    }
    note.textContent = t2;
    note.className = `taskNote${kind ? ` ${kind}` : ""}`;
    note.style.display = "block";
  }
  function setChip(key, text, cls) {
    const chip = taskUi[key]?.chip;
    if (!chip) return;
    chip.textContent = text;
    chip.className = `chip${cls ? ` ${cls}` : ""}`;
  }
  function setProgressFill(fill, processed, total, indet) {
    if (!fill) return;
    const el2 = fill;
    el2.className = `progFill${indet ? " indet" : ""}`;
    if (indet) {
      el2.style.width = "40%";
      return;
    }
    const p = Number(processed);
    const t2 = Number(total);
    if (Number.isFinite(p) && Number.isFinite(t2) && t2 > 0) {
      const pct = Math.max(0, Math.min(1, p / t2)) * 100;
      el2.style.width = `${pct.toFixed(1)}%`;
      return;
    }
    if (Number.isFinite(p) && p > 0) {
      el2.style.width = "100%";
      return;
    }
    el2.style.width = "0%";
  }
  function setTaskMeta(meta) {
    const key = meta.key;
    const ui = taskUi[key];
    if (!ui) return;
    const processed = Number(meta.processed ?? 0);
    const total = Number(meta.total ?? 0);
    const hasTotal = Number.isFinite(total) && total > 0;
    updateFriendsFallback(meta);
    updateWallMini(meta);
    if (meta.state === "running") {
      setChip(key, t("popup.runtime.running"), "warn");
      setProgressFill(ui.fill, processed, hasTotal ? total : void 0, !hasTotal);
      if (ui.text) ui.text.textContent = hasTotal ? `${fmtNum(processed)} / ${fmtNum(total)}` : `${fmtNum(processed)}`;
      setNote(key, meta.note || null);
      return;
    }
    if (meta.state === "done") {
      setChip(key, t("popup.runtime.done"), "ok");
      if (hasTotal) setProgressFill(ui.fill, processed, total, false);
      else setProgressFill(ui.fill, 1, 1, false);
      if (ui.text) ui.text.textContent = hasTotal ? `${fmtNum(processed)} / ${fmtNum(total)}` : `${fmtNum(processed)} collected`;
      setNote(key, meta.note || null);
      updateFriendsFallback(meta);
      return;
    }
    if (meta.ok === false || meta.state === "blocked" || meta.state === "error") {
      setChip(key, meta.state === "blocked" ? t("popup.runtime.blocked") : t("popup.runtime.error"), "bad");
      setProgressFill(ui.fill, 0, 0, false);
      if (ui.text) ui.text.textContent = "—";
      setNote(key, meta.error ? vkErrToText(meta.error) : meta.note || t("popup.runtime.requestFailed"), "bad");
      updateFriendsFallback(meta);
      return;
    }
    if (typeof meta.processed === "number" && meta.processed > 0) {
      setChip(key, t("popup.runtime.done"), "ok");
      setProgressFill(ui.fill, processed, hasTotal ? total : processed, false);
      if (ui.text) ui.text.textContent = hasTotal ? `${fmtNum(processed)} / ${fmtNum(total)}` : t("popup.runtime.collectedSuffix", { count: fmtNum(processed) });
      setNote(key, meta.note || null);
      updateFriendsFallback(meta);
      return;
    }
    setChip(key, t("popup.runtime.ready"));
    setProgressFill(ui.fill, 0, 0, false);
    if (ui.text) ui.text.textContent = "—";
    setNote(key, meta.note || null);
  }
  function setSession(meta, live) {
    const busy = meta;
    const liveState = live || lastPopupMeta?.live || null;
    const liveActive = !!liveState?.active;
    if (clearBusyBtn) clearBusyBtn.style.display = busy?.active ? "inline-block" : "none";
    if (sessionStateEl) {
      if (liveActive) sessionStateEl.textContent = liveState?.state === "running" ? t("popup.runtime.running") : String(liveState?.state || t("popup.runtime.active"));
      else sessionStateEl.textContent = busy?.active ? t("popup.runtime.sessionBusy", { reason: busy?.reason || "enrichment" }) : activeTask ? t("popup.runtime.running") : t("popup.runtime.idle");
    }
    if (sessionActiveEl) {
      sessionActiveEl.textContent = liveActive && liveState?.key ? fmtTaskName(liveState.key) : activeTask ? fmtTaskName(activeTask) : busy?.active ? busy?.reason || t("popup.runtime.busyGeneric") : "—";
    }
    if (sessionStageEl) {
      sessionStageEl.textContent = liveActive ? String(liveState?.note || "").trim() || t("popup.runtime.working") : "—";
    }
    if (sessionStartedEl) {
      sessionStartedEl.textContent = liveActive && liveState?.startedAt ? fmtWhen(Number(liveState.startedAt)) : "—";
    }
    updateQueueUI();
    if (!sessionFillEl) return;
    if (liveActive) {
      const p = Number(liveState?.processed);
      const t2 = Number(liveState?.total);
      if (Number.isFinite(p) && Number.isFinite(t2) && t2 > 0) {
        const pct = Math.max(0, Math.min(1, p / t2)) * 100;
        sessionFillEl.className = "progFill";
        sessionFillEl.style.width = `${pct.toFixed(1)}%`;
      } else {
        sessionFillEl.className = "progFill indet";
        sessionFillEl.style.width = "40%";
      }
      return;
    }
    if (activeTask || busy?.active) {
      sessionFillEl.className = "progFill indet";
      sessionFillEl.style.width = "40%";
    } else {
      sessionFillEl.className = "progFill";
      sessionFillEl.style.width = "0%";
    }
  }
  function fmtTarget(t2) {
    if (!t2) return "—";
    if (t2.kind === "user") return `user:${t2.id ?? t2.screenName ?? "—"}`;
    if (t2.kind === "group") return `group:${t2.id ?? t2.screenName ?? "—"}`;
    return t2.screenName ? `unknown:${t2.screenName}` : "unknown";
  }
  function fmtCtx(url) {
    try {
      const u = new URL(url);
      return `${u.hostname}${u.pathname}`;
    } catch {
      return url;
    }
  }
  async function download(filename, content, opts) {
    const url = URL.createObjectURL(content);
    try {
      await chrome.downloads.download({ url, filename, saveAs: !!opts?.saveAs });
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1e4);
    }
  }
  function safeExportNamePart(value) {
    return String(value ?? "").replace(/[<>:"/\\|?*\x00-\x1F]+/g, "_").replace(/\s+/g, " ").trim().replace(/ /g, "_").slice(0, 96) || "item";
  }
  function exportFolderName(bundle, stamp) {
    const t2 = bundle?.target;
    if (t2?.kind === "user") return `vkxtract_export_user_${safeExportNamePart(t2.id ?? t2.screenName ?? "unknown")}_${stamp}`;
    if (t2?.kind === "group") return `vkxtract_export_group_${safeExportNamePart(t2.id ?? t2.screenName ?? "unknown")}_${stamp}`;
    return `vkxtract_export_${safeExportNamePart(t2?.screenName || "unknown")}_${stamp}`;
  }
  function exportRunFilename(run, index) {
    const idx = String(index + 1).padStart(3, "0");
    const action = safeExportNamePart(run?.action || "run");
    const ts = Number(run?.ts);
    const stamp = Number.isFinite(ts) && ts > 0 ? safeExportNamePart(new Date(ts).toISOString().replace(/[:.]/g, "-")) : "no-ts";
    return `${idx}_${action}_${stamp}.json`;
  }
  function tsName() {
    const d = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }
  function setButtonsEnabled(enabled) {
    extractProfileBtn.disabled = !enabled.isTarget;
    extractFriendsBtn.disabled = !enabled.isTarget;
    extractFollowingBtn.disabled = !enabled.isUser;
    extractFollowersBtn.disabled = !enabled.isUser;
    extractCommunitiesBtn.disabled = !enabled.isUser;
    extractWallBtn.disabled = !enabled.isTarget;
    extractPhotosBtn.disabled = !enabled.isTarget;
    extractVideosBtn.disabled = !enabled.isTarget;
    extractStoriesBtn.disabled = !enabled.isTarget;
    extractGiftsBtn.disabled = !enabled.isUser;
    exportBtn.disabled = false;
    reportBtn.disabled = false;
    resetBtn.disabled = false;
    setTaskDisabledUi("profile", !enabled.isTarget);
    setTaskDisabledUi("friends", !enabled.isTarget);
    setTaskDisabledUi("followers", !enabled.isUser);
    setTaskDisabledUi("following", !enabled.isUser);
    setTaskDisabledUi("communities", !enabled.isUser);
    setTaskDisabledUi("wall", !enabled.isTarget);
    setTaskDisabledUi("photos", !enabled.isTarget);
    setTaskDisabledUi("videos", !enabled.isTarget);
    setTaskDisabledUi("stories", !enabled.isTarget);
    setTaskDisabledUi("gifts", !enabled.isUser);
    if (!enabled.isTarget) {
      setStepOpen(stepProfileNetworkEl, true);
      setStepOpen(stepMediaEl, false);
      setStepOpen(stepWallExportEl, true);
      return;
    }
    if (popupStepStateTouched) {
      syncWorkflowCarets();
      return;
    }
    const savedProfile = getSavedStepPref(stepProfileNetworkEl);
    const savedMedia = getSavedStepPref(stepMediaEl);
    const savedWall = getSavedStepPref(stepWallExportEl);
    setStepOpen(stepProfileNetworkEl, savedProfile ?? true);
    setStepOpen(stepMediaEl, savedMedia ?? true);
    setStepOpen(stepWallExportEl, savedWall ?? true);
  }
  function applyTargetAvailability(enabled) {
    const { isTarget, isUser, isGroup } = enabled;
    if (!isTarget) {
      for (const k of Object.keys(taskUi)) {
        setNote(k, t("popup.runtime.openVkTargetToEnable"), "warn");
        setChip(k, t("popup.runtime.disabled"));
      }
      resetWallMini();
      return;
    }
    for (const k of Object.keys(taskUi)) {
      if (!lastPopupMeta?.tasks?.[k]?.error) setNote(k, null);
      if (!lastPopupMeta?.tasks?.[k]?.processed) setChip(k, t("popup.runtime.ready"));
    }
    if (isGroup) {
      setNote("followers", t("popup.runtime.notAvailableForCommunityTargets"), "warn");
      setNote("following", t("popup.runtime.notAvailableForCommunityTargets"), "warn");
      setNote("communities", t("popup.runtime.notAvailableForCommunityTargets"), "warn");
      setNote("gifts", t("popup.runtime.notAvailableForCommunityTargets"), "warn");
    }
    if (!isUser) {
      setNote("followers", t("popup.runtime.notAvailableForThisTargetType"), "warn");
      setNote("following", t("popup.runtime.notAvailableForThisTargetType"), "warn");
      setNote("communities", t("popup.runtime.notAvailableForThisTargetType"), "warn");
      setNote("gifts", t("popup.runtime.notAvailableForThisTargetType"), "warn");
    }
    if (!lastPopupMeta?.tasks?.wall) {
      resetWallMini();
    }
  }
  async function refreshPopupMeta() {
    try {
      const r = await sendToBg({ type: "VKX_POPUP_GET_META" });
      if (!r?.ok) return;
      lastPopupMeta = r;
      const tasks = r.tasks || {};
      for (const k of Object.keys(taskUi)) {
        const m = tasks[k];
        if (m) setTaskMeta({ ...m, key: k });
      }
      setSession(r.busy, r.live);
    } catch {
    }
  }
  async function refresh() {
    try {
      const page = await sendToTab({ type: "VKX_GET_PAGE" });
      if (!page?.ok) throw new Error(t("popup.runtime.notOnVk"));
      ctxEl.textContent = fmtCtx(page.url);
      const det = await sendToBg({ type: "VKX_DETECT_TARGET", pageUrl: page.url }).catch(() => null);
      const detectedTarget = det?.target;
      const stats = await sendToBg({ type: "VKX_GET_STATS" });
      const target = detectedTarget || stats.target;
      targetEl.textContent = fmtTarget(target);
      lastEl.textContent = stats.lastAction || "—";
      const kind = target?.kind;
      const isUser = kind === "user";
      const isGroup = kind === "group";
      const isTarget = isUser || isGroup;
      setButtonsEnabled({ onVk: true, isTarget, isUser, isGroup });
      applyTargetAvailability({ isTarget, isUser, isGroup });
      await refreshPopupMeta();
      if (tokenStatusEl) {
        tokenStatusEl.textContent = stats.tokenSet ? stats.tokenMask ? `${t("popup.runtime.storedLocally")} ${stats.tokenMask}` : t("popup.runtime.storedLocally") : t("popup.runtime.notLoaded");
      }
      if (tokenHintEl) {
        tokenHintEl.textContent = stats.tokenSet ? t("popup.runtime.savedLocallyForReuse") : t("popup.runtime.openVkTargetToEnable");
      }
      if (caseKeyEl) caseKeyEl.textContent = String(stats.activeCaseKey || t("popup.runtime.unknown"));
      if (targetKindEl) targetKindEl.textContent = String(stats.target?.kind || t("popup.runtime.unknown"));
      if (runsCountEl) runsCountEl.textContent = fmtNum(stats.runs || 0);
      tokenInp.placeholder = stats.tokenSet ? t("popup.runtime.pasteOrReplaceToken") : t("popup.runtime.pasteToken");
      setStatus(stats.tokenSet ? t("popup.runtime.tokenSaved") : t("popup.runtime.noTokenLoaded"));
    } catch {
      ctxEl.textContent = "Not on VK";
      targetEl.textContent = "—";
      lastEl.textContent = "—";
      if (tokenStatusEl) tokenStatusEl.textContent = t("popup.runtime.unknown");
      if (tokenHintEl) tokenHintEl.textContent = t("popup.runtime.openVkTargetToRescan");
      if (caseKeyEl) caseKeyEl.textContent = t("popup.runtime.unknown");
      if (targetKindEl) targetKindEl.textContent = t("popup.runtime.unknown");
      if (runsCountEl) runsCountEl.textContent = "0";
      setStatus(t("popup.runtime.openVkTargetToEnable"));
      extractProfileBtn.disabled = true;
      extractFriendsBtn.disabled = true;
      extractFollowingBtn.disabled = true;
      extractFollowersBtn.disabled = true;
      extractCommunitiesBtn.disabled = true;
      extractWallBtn.disabled = true;
      extractPhotosBtn.disabled = true;
      extractVideosBtn.disabled = true;
      extractStoriesBtn.disabled = true;
      extractGiftsBtn.disabled = true;
      setTaskDisabledUi("profile", true);
      setTaskDisabledUi("friends", true);
      setTaskDisabledUi("followers", true);
      setTaskDisabledUi("following", true);
      setTaskDisabledUi("communities", true);
      setTaskDisabledUi("wall", true);
      setTaskDisabledUi("photos", true);
      setTaskDisabledUi("videos", true);
      setTaskDisabledUi("stories", true);
      setTaskDisabledUi("gifts", true);
      setSession({ active: false }, lastPopupMeta?.live);
    }
  }
  async function runTask(actionType, key, pageUrl, successMsg, payload) {
    activeTask = key;
    setSession(lastPopupMeta?.busy, lastPopupMeta?.live);
    setTaskMeta({
      key,
      state: "running",
      processed: lastPopupMeta?.tasks?.[key]?.processed ?? 0,
      total: lastPopupMeta?.tasks?.[key]?.total,
      note: t("popup.runtime.working")
    });
    setStatus(t("popup.runtime.working"));
    toast("info", t("popup.runtime.working"));
    try {
      const msg = { type: actionType, pageUrl, ...payload || {} };
      const r = await sendToBg(msg);
      if (!r?.ok) throw new Error(r?.error || "extract_failed");
      await refreshPopupMeta();
      const m = lastPopupMeta?.tasks?.[key];
      if (m && m.ok === false) {
        toast("bad", vkErrToText(m.error));
        setStatus(t("popup.runtime.blocked"));
      } else {
        toast("ok", successMsg);
        setStatus(t("popup.runtime.ok"));
      }
      return r;
    } finally {
      activeTask = null;
      setSession(lastPopupMeta?.busy, lastPopupMeta?.live);
      if (!queueDraining && taskQueue.length) kickDrain();
    }
  }
  refreshBtn.addEventListener("click", async () => {
    refreshBtn.disabled = true;
    try {
      await refresh();
    } finally {
      refreshBtn.disabled = false;
    }
  });
  reloadTabBtn?.addEventListener("click", async () => {
    reloadTabBtn.disabled = true;
    try {
      const tabId = await getActiveTabId();
      if (!tabId) throw new Error("No active tab");
      await new Promise((resolve, reject) => {
        let done = false;
        const finish = (err) => {
          if (done) return;
          done = true;
          try {
            chrome.tabs.onUpdated.removeListener(onUpdated);
          } catch {
          }
          if (timeoutId) window.clearTimeout(timeoutId);
          if (err) reject(err);
          else resolve();
        };
        const onUpdated = (updatedTabId, info) => {
          if (updatedTabId !== tabId) return;
          if (info.status === "complete") finish();
        };
        const timeoutId = window.setTimeout(() => finish(), 1e4);
        chrome.tabs.onUpdated.addListener(onUpdated);
        chrome.tabs.reload(tabId).catch((err) => finish(err));
      });
      toast("ok", t("popup.runtime.vkTabReloaded"));
      await refresh();
    } catch (e) {
      toast("bad", String(e?.message || e));
    } finally {
      reloadTabBtn.disabled = false;
    }
  });
  clearBusyBtn?.addEventListener("click", async () => {
    clearBusyBtn.disabled = true;
    try {
      await sendToBg({ type: "VKX_CLEAR_BUSY" });
      toast("ok", t("popup.runtime.busyLockCleared"));
    } catch (e) {
      toast("bad", String(e?.message || e));
    } finally {
      clearBusyBtn.disabled = false;
      await refreshPopupMeta();
      await refresh();
    }
  });
  saveTokenBtn.addEventListener("click", async () => {
    saveTokenBtn.disabled = true;
    try {
      const token = tokenInp.value.trim();
      await sendToBg({ type: "VKX_SET_TOKEN", token });
      tokenInp.value = "";
      toast("ok", t("popup.runtime.tokenSaved"));
    } catch (e) {
      toast("bad", String(e?.message || e));
    } finally {
      saveTokenBtn.disabled = false;
      await refresh();
    }
  });
  clearTokenBtn.addEventListener("click", async () => {
    clearTokenBtn.disabled = true;
    try {
      await sendToBg({ type: "VKX_CLEAR_TOKEN" });
      tokenInp.value = "";
      toast("ok", t("popup.runtime.tokenCleared"));
    } catch (e) {
      toast("bad", String(e?.message || e));
    } finally {
      clearTokenBtn.disabled = false;
      await refresh();
    }
  });
  extractProfileBtn.addEventListener("click", async () => {
    extractProfileBtn.disabled = true;
    try {
      const page = await sendToTab({ type: "VKX_GET_PAGE" });
      await runOrQueue("VKX_EXTRACT_PROFILE", "profile", page.url, t("popup.runtime.profileExtracted"));
    } catch (e) {
      toast("bad", String(e?.message || e));
      setStatus(t("popup.runtime.error"));
    } finally {
      extractProfileBtn.disabled = false;
      await refresh();
    }
  });
  extractFriendsBtn.addEventListener("click", async () => {
    extractFriendsBtn.disabled = true;
    try {
      const page = await sendToTab({ type: "VKX_GET_PAGE" });
      await runOrQueue("VKX_EXTRACT_FRIENDS", "friends", page.url, t("popup.runtime.friendsExtracted"));
    } catch (e) {
      toast("bad", String(e?.message || e));
      setStatus(t("popup.runtime.error"));
    } finally {
      extractFriendsBtn.disabled = false;
      await refresh();
    }
  });
  extractFollowersBtn.addEventListener("click", async () => {
    extractFollowersBtn.disabled = true;
    try {
      const page = await sendToTab({ type: "VKX_GET_PAGE" });
      await runOrQueue("VKX_EXTRACT_FOLLOWERS", "followers", page.url, t("popup.runtime.followersExtracted"));
    } catch (e) {
      toast("bad", String(e?.message || e));
    } finally {
      extractFollowersBtn.disabled = false;
      await refresh();
    }
  });
  extractFollowingBtn.addEventListener("click", async () => {
    extractFollowingBtn.disabled = true;
    try {
      const page = await sendToTab({ type: "VKX_GET_PAGE" });
      await runOrQueue("VKX_EXTRACT_FOLLOWING", "following", page.url, t("popup.runtime.followingExtracted"));
    } catch (e) {
      toast("bad", String(e?.message || e));
      setStatus(t("popup.runtime.error"));
    } finally {
      extractFollowingBtn.disabled = false;
      await refresh();
    }
  });
  extractCommunitiesBtn.addEventListener("click", async () => {
    extractCommunitiesBtn.disabled = true;
    try {
      const page = await sendToTab({ type: "VKX_GET_PAGE" });
      await runOrQueue("VKX_EXTRACT_COMMUNITIES", "communities", page.url, t("popup.runtime.communitiesExtracted"));
    } catch (e) {
      toast("bad", String(e?.message || e));
      setStatus(t("popup.runtime.error"));
    } finally {
      extractCommunitiesBtn.disabled = false;
      await refresh();
    }
  });
  extractWallBtn.addEventListener("click", async () => {
    extractWallBtn.disabled = true;
    try {
      const page = await sendToTab({ type: "VKX_GET_PAGE" });
      const maxPosts = Math.max(1, Math.min(5e3, Math.floor(Number(wallMaxPostsInp?.value ?? 200))));
      const includeComments = !!wallIncCommentsCb?.checked;
      const includeLikers = !!wallIncLikesCb?.checked;
      const range = wallRangePayloadPart();
      const payload = {
        maxPosts,
        includeComments,
        includeLikers,
        fromTs: range.fromTs,
        toTs: range.toTs,
        // internal defaults for now
        maxCommentsPerPost: 1e3,
        maxLikersPerPost: 5e3
      };
      await runOrQueue("VKX_EXTRACT_WALL_SNAPSHOT", "wall", page.url, "Wall snapshot captured.", payload);
    } catch (e) {
      toast("bad", String(e?.message || e));
      setStatus(t("popup.runtime.error"));
    } finally {
      extractWallBtn.disabled = false;
      await refresh();
    }
  });
  friendsFallbackWallBtn?.addEventListener("click", async () => {
    if (!friendsFallbackWallBtn) return;
    friendsFallbackWallBtn.disabled = true;
    try {
      const page = await sendToTab({ type: "VKX_GET_PAGE" });
      const maxPosts = Math.max(1, Math.min(5e3, Math.floor(Number(wallMaxPostsInp?.value ?? 200))));
      const includeComments = !!wallIncCommentsCb?.checked;
      const includeLikers = !!wallIncLikesCb?.checked;
      const range = wallRangePayloadPart();
      const payload = {
        maxPosts,
        includeComments,
        includeLikers,
        fromTs: range.fromTs,
        toTs: range.toTs,
        maxCommentsPerPost: 1e3,
        maxLikersPerPost: 5e3
      };
      await runOrQueue("VKX_EXTRACT_WALL_SNAPSHOT", "wall", page.url, "Wall snapshot captured. Observed network can now be derived from it.", payload);
    } catch (e) {
      toast("bad", String(e?.message || e));
      setStatus(t("popup.runtime.error"));
    } finally {
      friendsFallbackWallBtn.disabled = false;
      await refresh();
    }
  });
  extractPhotosBtn.addEventListener("click", async () => {
    extractPhotosBtn.disabled = true;
    try {
      const page = await sendToTab({ type: "VKX_GET_PAGE" });
      await runOrQueue("VKX_EXTRACT_PHOTOS", "photos", page.url, t("popup.runtime.photosExtracted"));
    } catch (e) {
      toast("bad", String(e?.message || e));
      setStatus(t("popup.runtime.error"));
    } finally {
      extractPhotosBtn.disabled = false;
      await refresh();
    }
  });
  extractVideosBtn.addEventListener("click", async () => {
    extractVideosBtn.disabled = true;
    try {
      const page = await sendToTab({ type: "VKX_GET_PAGE" });
      await runOrQueue("VKX_EXTRACT_VIDEOS", "videos", page.url, t("popup.runtime.videosExtracted"));
    } catch (e) {
      toast("bad", String(e?.message || e));
      setStatus(t("popup.runtime.error"));
    } finally {
      extractVideosBtn.disabled = false;
      await refresh();
    }
  });
  extractStoriesBtn.addEventListener("click", async () => {
    extractStoriesBtn.disabled = true;
    try {
      const page = await sendToTab({ type: "VKX_GET_PAGE" });
      await runOrQueue("VKX_EXTRACT_STORIES", "stories", page.url, t("popup.runtime.storiesExtractedIfAvailable"));
    } catch (e) {
      toast("bad", String(e?.message || e));
      setStatus(t("popup.runtime.error"));
    } finally {
      extractStoriesBtn.disabled = false;
      await refresh();
    }
  });
  extractGiftsBtn.addEventListener("click", async () => {
    extractGiftsBtn.disabled = true;
    try {
      const page = await sendToTab({ type: "VKX_GET_PAGE" });
      await runOrQueue("VKX_EXTRACT_GIFTS", "gifts", page.url, t("popup.runtime.giftsExtractedIfAvailable"));
    } catch (e) {
      toast("bad", String(e?.message || e));
      setStatus(t("popup.runtime.error"));
    } finally {
      extractGiftsBtn.disabled = false;
      await refresh();
    }
  });
  resetBtn.addEventListener("click", async () => {
    resetBtn.disabled = true;
    try {
      await sendToBg({ type: "VKX_RESET" });
      toast("ok", "Session cleared");
      taskQueue.length = 0;
      updateQueueUI();
    } catch (e) {
      toast("bad", String(e?.message || e));
    } finally {
      resetBtn.disabled = false;
      await refresh();
    }
  });
  exportBtn.addEventListener("click", async () => {
    exportBtn.disabled = true;
    try {
      const bundle = await sendToBg({ type: "VKX_EXPORT_BUNDLE" });
      const stamp = tsName();
      const folder = exportFolderName(bundle, stamp);
      const runs = Array.isArray(bundle?.runs) ? bundle.runs : [];
      const manifest = {
        exported_at: (/* @__PURE__ */ new Date()).toISOString(),
        folder,
        target: bundle?.target || null,
        run_count: runs.length,
        files: [
          "bundle.json",
          "target.json",
          "manifest.json",
          ...runs.map((run, index) => `runs/${exportRunFilename(run, index)}`)
        ]
      };
      await download(`${folder}/bundle.json`, new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" }));
      await download(`${folder}/target.json`, new Blob([JSON.stringify(bundle?.target || null, null, 2)], { type: "application/json" }));
      await download(`${folder}/manifest.json`, new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" }));
      for (let i = 0; i < runs.length; i++) {
        const run = runs[i];
        await download(`${folder}/runs/${exportRunFilename(run, i)}`, new Blob([JSON.stringify(run, null, 2)], { type: "application/json" }));
      }
      toast("ok", `Raw JSON export folder saved (${runs.length} run files + bundle)`);
    } finally {
      exportBtn.disabled = false;
      await refresh();
    }
  });
  reportBtn.addEventListener("click", async () => {
    reportBtn.disabled = true;
    try {
      try {
        const page = await sendToTab({ type: "VKX_GET_PAGE" });
        if (page?.ok && page.url) {
          await sendToBg({ type: "VKX_DETECT_TARGET", pageUrl: page.url });
        }
      } catch {
      }
      await chrome.tabs.create({ url: chrome.runtime.getURL("report.html") });
      toast("ok", "Report opened");
    } catch (e) {
      toast("bad", String(e?.message || e));
      setStatus(t("popup.runtime.error"));
    } finally {
      reportBtn.disabled = false;
      await refresh();
    }
  });
  openLegalBtn?.addEventListener("click", async () => {
    try {
      await chrome.tabs.create({ url: chrome.runtime.getURL("legal.html") });
    } catch (e) {
      toast("bad", String(e?.message || e));
      setStatus(t("popup.runtime.error"));
    }
  });
  for (const stepEl of [stepProfileNetworkEl, stepMediaEl, stepWallExportEl]) {
    stepEl?.addEventListener("toggle", () => {
      popupStepStateTouched = true;
      saveStepPref(stepEl);
      syncWorkflowCarets();
    });
  }
  if (storagePanel) {
    storagePanel.addEventListener("toggle", () => {
      if (storagePanel.open) refreshStorageList().catch(() => {
      });
    });
  }
  storageRefreshBtn?.addEventListener("click", async () => {
    storageRefreshBtn.disabled = true;
    try {
      await refreshStorageList();
    } finally {
      storageRefreshBtn.disabled = false;
    }
  });
  deleteCurrentBtn?.addEventListener("click", async () => {
    const ok = window.confirm(t("popup.runtime.deleteCurrentTargetConfirm"));
    if (!ok) return;
    deleteCurrentBtn.disabled = true;
    try {
      const page = await sendToTab({ type: "VKX_GET_PAGE" }).catch(() => null);
      const det = page?.ok && page.url ? await sendToBg({ type: "VKX_DETECT_TARGET_PREVIEW", pageUrl: page.url }).catch(() => null) : null;
      const key = popupCaseKeyFromTarget(det?.target);
      if (key && key !== "unknown") {
        await sendToBg({ type: "VKX_DELETE_TARGET", key });
      } else {
        await sendToBg({ type: "VKX_DELETE_ACTIVE_TARGET" });
      }
      toast("ok", t("popup.runtime.deletedCurrentTargetData"));
      taskQueue.length = 0;
      updateQueueUI();
    } catch (e) {
      toast("bad", String(e?.message || e));
    } finally {
      deleteCurrentBtn.disabled = false;
      await refresh();
      if (storagePanel?.open) await refreshStorageList();
    }
  });
  deleteAllBtn?.addEventListener("click", async () => {
    const ok = window.confirm(t("popup.runtime.deleteAllTargetsConfirm"));
    if (!ok) return;
    deleteAllBtn.disabled = true;
    try {
      await sendToBg({ type: "VKX_DELETE_ALL_DATA" });
      toast("ok", t("popup.runtime.deletedAllStoredData"));
      taskQueue.length = 0;
      updateQueueUI();
    } catch (e) {
      toast("bad", String(e?.message || e));
    } finally {
      deleteAllBtn.disabled = false;
      await refresh();
      if (storagePanel?.open) await refreshStorageList();
    }
  });
  chrome.runtime.onMessage.addListener((msg) => {
    const m = msg || {};
    if (m.type === "VKX_POPUP_TASK_UPDATE") {
      const key = String(m.key || "");
      if (taskUi[key]) {
        const meta = {
          key,
          state: m.state,
          ok: typeof m.ok === "boolean" ? m.ok : void 0,
          processed: Number.isFinite(Number(m.processed)) ? Number(m.processed) : void 0,
          total: Number.isFinite(Number(m.total)) ? Number(m.total) : void 0,
          note: typeof m.note === "string" ? m.note : void 0,
          error: m.error ? { code: Number(m.error.code), msg: String(m.error.msg || "") } : void 0
        };
        setTaskMeta(meta);
        if (meta.state === "running") activeTask = key;
        if (meta.state === "done" || meta.state === "blocked" || meta.state === "error") {
          if (activeTask === key) activeTask = null;
          refreshPopupMeta().catch(() => {
          });
        }
        if (m.live && typeof m.live === "object") {
          lastPopupMeta = { ...lastPopupMeta || { ok: true }, live: m.live };
        }
        setSession(
          lastPopupMeta?.busy,
          m.live && typeof m.live === "object" ? m.live : lastPopupMeta?.live
        );
      }
    }
  });
  wallIncCommentsCb?.addEventListener("change", () => {
    refreshWallMiniIdleState();
  });
  wallIncLikesCb?.addEventListener("change", () => {
    refreshWallMiniIdleState();
  });
  wallUseDateRangeCb?.addEventListener("change", () => {
    syncWallRangeUi();
  });
  wallDateFromInp?.addEventListener("input", () => {
    syncWallRangeUi();
  });
  wallDateToInp?.addEventListener("input", () => {
    syncWallRangeUi();
  });
  wallDateFromInp?.addEventListener("click", () => {
    try {
      wallDateFromInp.showPicker?.();
    } catch {
    }
  });
  wallDateToInp?.addEventListener("click", () => {
    try {
      wallDateToInp.showPicker?.();
    } catch {
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    loadLocale();
    applyPopupI18n();
    if (langSwitchEl) {
      langSwitchEl.value = getLocale();
      langSwitchEl.addEventListener("change", () => {
        const next = langSwitchEl.value === "uk" ? "uk" : "en";
        setLocale(next);
        applyPopupI18n();
        refreshWallMiniIdleState();
        syncWallRangeUi();
        refresh().catch(() => {
        });
        if (storagePanel?.open) refreshStorageList().catch(() => {
        });
      });
    }
    syncWorkflowCarets();
    syncWallRangeUi();
    refreshWallMiniIdleState();
    refresh().catch(() => {
    });
    if (storagePanel?.open) refreshStorageList().catch(() => {
    });
  });
})();
//# sourceMappingURL=popup.js.map
