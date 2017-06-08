

const mail = {
    state: {
        mailId: '',
        draftId: '',
        pageType: '',
        mailType: ''
    },
    mutations: {
        SET_MAIL_ID: (state, mailId) => {
            state.mailId = mailId;
        },
        SET_DRAFT_ID: (state, draftId) => {
            state.draftId = draftId;
        },
        SET_PAGE_TYPE: (state, pageType) => {
            state.pageType = pageType;
        },
        SET_MAIL_TYPE: (state, mailType) => {
            state.mailType = mailType;
        }
    }
}

export default mail;