define(['bootstrap/app', 'app/config-manager', 'services/http-service'], function (app) {
    'use strict';

    app.service('usercenter-service', ['http-service', function (http) {

        //保存通知
        this.SaveOrUpdateAdvice = function (data, callback) {
            http.post('/UserCenter/SaveOrUpdateAdvice', data, callback);
        };

        //删除通知
        this.DeleteAdviceByID = function (id, callback) {
            var url = "/UserCenter/DeleteAdviceByID?id=" + id;
            http.get(url, null, callback);
        };

        //获取技术文件
        this.GetAdviceByID = function (id, callback) {
            var url = "/UserCenter/GetAdviceByID?id=" + id;
            http.get(url, null, callback);
        };
        //获取通知列表
        this.getAdviceList = function (data, callback) {
            http.post('/UserCenter/getAdviceList', data, callback);
        };

        //获取最新10条通知
        this.getUpToDateAdviceinfos = function (data, callback) {
            http.post('/UserCenter/getUpToDateAdviceinfos', data, callback);
        };

        //获取留言信息
        this.getSuggestionList = function (data, callback) {
            http.post('/UserCenter/getSuggestionList', data, callback);
        }

        //删除留言
        this.DeleteSuggestionByID = function (id, callback) {
            var url = "/UserCenter/DeleteSuggestionByID?id=" + id;
            http.get(url, null, callback);
        }

        //保存留言
        this.SaveOrUpdateSuggestion = function (data, callback) {
            http.post('/UserCenter/SaveOrUpdateSuggestion', data, callback);
        }

        //获取反馈列表
        this.getFeedBackList = function (id, callback) {
            var url = "/UserCenter/getFeedBackList?id=" + id;
            http.get(url, null, callback);
        }

        //保存反馈信息
        this.SaveSuggestionFeedBack = function (data, callback) {
            http.post('/UserCenter/SaveSuggestionFeedBack', data, callback);
        }

        //保存审核
        this.SaveApprove = function (data, callback) {
            http.post('/UserCenter/SaveApprove', data, callback);
        }

        //获取审核信息
        this.getApproveHistroy = function (id, callback) {
            var url = "/UserCenter/getApproveHistroy?id=" + id;
            http.get(url, null, callback);
        }

        //获取用户收藏夹
        this.getFavoriteList = function (id, callback) {
            var url = "/UserCenter/getFavoriteList?id=" + id;
            http.get(url, null, callback);
        }

        //删除收藏夹子项
        this.DeleteFavoriteByID = function (id, callback) {
            var url = "/UserCenter/DeleteFavoriteByID?id=" + id;
            http.get(url, null, callback);
        }

        //保存收藏夹
        this.SaveOrUpdateFavorite = function (data, callback) {
            http.post('/UserCenter/SaveOrUpdateFavorite', data, callback);
        }

        //获取收藏夹对应的法规
        this.getLawsByLinkID = function (data, callback) {
            http.post('/UserCenter/getLawsByLinkID', data, callback);
        }

        //保存收藏夹与法规的关联
        this.SaveFavoriteLawsLink = function (data, callback) {
            http.post('/UserCenter/SaveFavoriteLawsLink', data, callback);
        }

        //获取法规对应的收藏夹Favorite
        this.getFavoriteListByLawID = function (id, callback) {
            var url = "/UserCenter/getFavoriteListByLawID?id=" + id;
            http.get(url, null, callback);
        }
        //取消收藏
        this.DismissFavorite = function (favid, lawid, callback) {
            var url = "/UserCenter/DismissFavorite?favid=" + favid + "&lawid=" + lawid;
            http.get(url, null, callback);
        }

        //更新密码
        this.updateUserPassword = function (id, oldpassword, newpassword, callback) {
            var url = "/UserCenter/updateUserPassword?id=" + id + "&oldpassword=" + oldpassword + "&newpassword=" + newpassword;
            http.get(url, null, callback);
        }

    }]);
});