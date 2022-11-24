exports.get404 = (req ,res ,next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found', path: '/404'});                           //we use status function to define the status like we did here for the 404 page
};
