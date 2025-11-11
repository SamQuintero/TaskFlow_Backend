import { connect } from 'mongoose';

export const connectDB = ():Promise<void> => {

	return new Promise((resolve, reject) => {
			connect(process.env.MONGO_URL!).then(() => {
			resolve();
			}).catch(() => {
					reject()
				})
	});
}