import { formatFetchedData } from "@Helpers/data.helper";
import { storage, db, getTime } from "../firebase.config";
import { ALLOWED_EXTNS } from "../constants";

const reportsRef = db.collection("reports");
const currentRef = db.collection("current");

async function get() {
  return reportsRef.orderBy("createdAt", "desc").get();
}

async function searchByName(query) {
  return reportsRef
    .where("fullName", ">=", query)
    .where("fullName", "<", `${query}z`)
    .limit(10)
    .get();
}

async function searchByPassportNo(query) {
  return reportsRef
    .where("passport", ">=", query)
    .where("passport", "<", `${query}z`)
    .limit(10)
    .get();
}

async function searchByExaminedDate(query) {
  return reportsRef
    .where("dateExamined", ">=", query)
    .where("dateExamined", "<", `${query}z`)
    .get();
}

async function searchByLabSrNo(query) {
  const newQuery = `MT_${query}`;
  return reportsRef
    .where("labSrNo", ">=", newQuery)
    .where("labSrNo", "<", `${newQuery}z`)
    .limit(5)
    .get();
}

async function getById(id) {
  let report;

  const doc = await reportsRef.doc(id).get();
  if (doc.exists) {
    const data = doc.data();
    report = formatFetchedData(data);
  } else {
    report = null;
  }

  return report;
}

async function update(formData) {
  const newFormData = { ...formData };
  newFormData.updatedAt = getTime.serverTimestamp();
  return reportsRef.doc(formData.labSrNo).update(newFormData);
}

async function save(formData) {
  const newFormData = { ...formData };
  newFormData.createdAt = getTime.serverTimestamp();

  const saveData = reportsRef.doc(`MT_${formData.lab + 1}`).set(newFormData);
  const updateCurrent = currentRef.doc(formData.id).update({
    lab: formData.lab + 1,
    refrence: formData.refrence + 1,
  });

  return Promise.all([saveData, updateCurrent]);
}

async function upload(photo) {
  return new Promise((resolve, reject) => {
    if (!photo) {
      reject(new Error("Please select a photo !"));
    }
    if (!ALLOWED_EXTNS.exec(photo.name)) {
      reject(new Error("Please upload a .jpg or .jpeg file"));
    }

    const date = new Date().toISOString();
    const name = `${photo.name}_${date}`;

    const uploadTask = storage.ref(`images/${name}`).put(photo);
    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        storage
          .ref("images")
          .child(name)
          .getDownloadURL()
          .then((url) => {
            resolve({ url, name });
          });
      }
    );
  });
}

async function getCurrent() {
  let res;
  const querySnapshot = await currentRef.get();
  querySnapshot.forEach((doc) => {
    res = { id: doc.id, ...doc.data() };
  });
  return res;
}

async function deleteReportById(photoName, id) {
  const deleteReport = reportsRef.doc(id).delete();
  const deletePhoto = storage.ref().child(`images/${photoName}`).delete();
  await Promise.all([deleteReport, deletePhoto]);
}

async function resetReference() {
  const snapshot = await currentRef.get();
  const docId = snapshot.docs[0].id;
  await currentRef.doc(docId).update({ refrence: 0 });
}

const ReportsApi = {
  get,
  searchByName,
  searchByLabSrNo,
  searchByPassportNo,
  searchByExaminedDate,
  getById,
  update,
  save,
  upload,
  getCurrent,
  delete: deleteReportById,
  resetReference,
};

export default ReportsApi;
