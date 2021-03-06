
import Action from 'd2-ui/lib/action/Action';
import { getInstance as getD2 } from 'd2/lib/d2';

const actions = Action.createActionsFromNames(['listInterpretation', 'updateLike', 'deleteInterpretation', 'editInterpretation'], 'interpretation');



actions.listInterpretation
    .subscribe(({ data: [model, page, searchData], complete }) => {
        getD2().then(d2 => {
            let url = `interpretations?fields=id,type,text,created,likes,likedBy[id,name],user[id,name],comments[id,created,text,user[id,name]],chart[id,name],map[id,name],reportTable[id,name]&page=${page}&pageSize=5${searchData}`;

            d2.Api.getApi().get(url)
				.then(result => {
    complete(result);
})
.catch(errorResponse => {
    console.log(errorResponse);
				});
        });
    });

actions.deleteInterpretation
    .subscribe(({ data: [model, id], complete }) => {
        const deleteMessage = confirm('Are you sure you want to delete this interpretation?');
        if (deleteMessage) {
            getD2().then(d2 => {
                d2.Api.getApi().delete(`interpretations/${id}`)
                    .then(complete)
                    .catch(complete);
            });
        }
    });

actions.updateLike.subscribe(({ data: [model, id], complete }) => {
    getD2().then(d2 => {
        d2.Api.getApi().post(`interpretations/${id}/like`)
			.then(complete)
			.catch(errorResponse => {
    console.log(errorResponse);
			});
    });
});

actions.editInterpretation
    .subscribe(({ data: [model, id, value], complete }) => {
        getD2().then(d2 => {
            const url = `../../interpretations/${id}`;

            d2.Api.getApi().request('PUT', url, value, { contentType: 'text/plain' })
				.then(complete)
                .catch(errorResponse => {
                    console.log(errorResponse);
                });
        });
    });

export default actions;

