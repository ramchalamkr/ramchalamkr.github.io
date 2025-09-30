// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-patents",
          title: "patents",
          description: "A list of my patents.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/patents/";
          },
        },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-graduated-from-model-engineering-college-thrikkakara-india-cusat-b-tech-in-cse",
          title: 'Graduated from Model Engineering College, Thrikkakara, India (CUSAT), B-Tech in CSE',
          description: "",
          section: "News",},{id: "news-join-bharat-petroleum-corporation-limited-bpcl-india-mumbai-as-a-software-engineer-for-the-lpg-team",
          title: 'Join Bharat Petroleum Corporation Limited (BPCL), India, Mumbai as a Software Engineer for...',
          description: "",
          section: "News",},{id: "news-graduated-from-mcgill-university-montreal-canada-msc-in-cs-thesis",
          title: 'Graduated from McGill University, Montreal, Canada, MSc in CS (Thesis)',
          description: "",
          section: "News",},{id: "news-paper-detection-of-errors-in-multi-genome-alignments-using-machine-learning-approaches-accepted-at-bibe-2028-link",
          title: 'Paper “Detection of Errors in Multi-genome Alignments Using Machine Learning Approaches “ accepted...',
          description: "",
          section: "News",},{id: "news-thesis-rlalign-a-reinforcement-learning-approach-for-multiple-sequence-alignment-accepted-at-bibe-2028-link",
          title: 'Thesis “Rlalign: a reinforcement learning approach for multiple sequence alignment “ accepted at...',
          description: "",
          section: "News",},{id: "news-join-noah-s-ark-lab-huawei-montreal-as-a-ml-research-engineer-on-the-accelerated-neural-technology-ant-team",
          title: 'Join Noah’s Ark Lab (Huawei), Montreal as a ML Research Engineer on the...',
          description: "",
          section: "News",},{id: "news-paper-deep-demosaicing-for-edge-implementation-accepted-at-iciar-2019-link",
          title: 'Paper “Deep Demosaicing for Edge Implementation “ accepted at ICIAR 2019. 🎉✨ [link]...',
          description: "",
          section: "News",},{id: "news-join-qualcomm-qualcomm-ai-research-as-a-ml-research-engineer-on-the-embedded-ai-team",
          title: 'Join Qualcomm (Qualcomm AI Research) as a ML Research Engineer on the Embedded...',
          description: "",
          section: "News",},{id: "news-paper-an-empirical-study-of-low-precision-quantization-for-tinyml-accepted-at-tinyml-research-symposium-2022-link",
          title: 'Paper “An Empirical Study of Low Precision Quantization for TinyML “ accepted at...',
          description: "",
          section: "News",},{id: "news-patent-selective-neural-network-pruning-by-masking-filters-using-scaling-factors-has-been-granted-smile-link",
          title: 'Patent “Selective neural network pruning by masking filters using scaling factors “ has...',
          description: "",
          section: "News",},{id: "news-paper-forward-forward-algorithm-for-on-device-learning-accepted-at-neurips-2024-link",
          title: 'Paper “Forward-Forward Algorithm for On-Device Learning “ accepted at NeurIPS 2024. 🎉✨ [link]...',
          description: "",
          section: "News",},{id: "news-paper-omnidraft-a-cross-vocabulary-online-adaptive-drafter-for-on-device-speculative-decoding-accepted-at-neurips-2025-link",
          title: 'Paper “OmniDraft: A Cross-vocabulary, Online Adaptive Drafter for On-device Speculative Decoding “ accepted...',
          description: "",
          section: "News",},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
