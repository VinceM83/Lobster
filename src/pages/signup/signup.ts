import { Component, OnInit } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { InfosPage } from "./infos/infos";
import { UserService } from "../../services/user.service";
import { User } from "../../models/User.model";
// import { matchOtherValidator } from "@moebius/ng-validators";

@Component({
	selector: "page-signup",
	templateUrl: "signup.html"
})
export class SignupPage implements OnInit {
	// Formulaire (méthode réactive)
	public registerForm: FormGroup;
	// Fichier en cours de téléchargement
	public fileIsUploading = false;
	// Url du fichier
	public fileUrl: string;
	// Fichier téléchargé
	public fileUploaded = false;
	// Utilisateur
	private user: User;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private authService: AuthService,
		private formBuilder: FormBuilder,
		private userService: UserService
	) {}

	ngOnInit() {
		// Initialisation du formulaire
		this.initForm();
	}

	// Initialisation du formulaire
	initForm() {
		this.registerForm = this.formBuilder.group({
			// Email requis, type email demandé
			email: ["", [Validators.required, Validators.email]],
			// Mot de passe requis, au moins 6 caractères
			password: [
				"",
				[
					Validators.required,
					// Validators.pattern(/[0-9a-zA-Z]{6,}/),
					Validators.minLength(6),
					Validators.pattern(/[0-9a-zA-Z-+=_.,:;~`!@#$%^&*(){}<>\[\]"'\/\\]{6,}/)
				]
			],
			// confirmPassword: [
			// 	"",
			// 	[Validators.required, matchOtherValidator("password")]
			// ],
			// Date de naissance requise
			birthday: [
				null,
				[
					Validators.required
				]
			],
			// Pseudo requis
			pseudo: [
				"",
				[
					Validators.required,
					Validators.pattern(/[0-9a-zA-Z-+=_.,:;~`!@#$%^&*(){}<>\[\]"'\/\\]{6,}/)
				]
			]
		});
	}

	// Fonction de téléchargement de l'image
	onUploadFile(file: File) {
		// Fichier en cours de téléchargement
		this.fileIsUploading = true;
		// Téléchargemet de l'image
		this.userService.uploadFile(file).then(
			(url: string) => {
			// Récupération de l'url de l'image après téléchargement
			this.fileUrl = url;
			// Téléchargement termné
			this.fileIsUploading = false;
			// Photo téléchargée
			this.fileUploaded = true;
			// Popup indiquant que la photo a été chargée
			this.userService.presentToast("Photo chargée");
			}
		);
	}

	// Fonction lancée lors d'un changement d'état dans la vue
	detectFiles(event) {
		// Lancement de la fonction de téléchargement de l'image
		this.onUploadFile(event.target.files[0]);
	}

	// Bouton désactivé jusqu'à ce que le formulaire soit valide et que l'image soit chargée
	isThisDisabled() {
		// Si le formulaire est invalide
		if (this.registerForm.invalid) {
			// Bouton désactivé
			return true;
		} else {
			// Sinon, si l'image est chargée
			if (!this.fileUploaded) {
				// Bouton désactivé
				return true;
			} else {
				// Sinon, bouton activé
				return false;
			}
		}
	}

	// Enregistrement de l'utilisateur et de ses informations
	onSaveUser() {
		// Récupération des données du formulaire
		const birthday = this.registerForm.get("birthday").value;
		const email = this.registerForm.get("email").value;
		const password = this.registerForm.get("password").value;
		const pseudo = this.registerForm.get("pseudo").value;
		// Initialisation des données non encore fournies
		const choix = "";
		const sexe = "";
		let photo = "";
		// Récupération de l'url de la photo
		if (this.fileUrl && this.fileUrl !== "") {
			photo = this.fileUrl;
		}
		// Assignation des données recueillies à l'objet l'utilisateur
		this.user = new User(pseudo, birthday, choix, sexe, photo);

		// Enregistrement de l'utilisateur après l'enregistrement de l'authentification
		this.authService.signUpUser(email, password).then(
			() => {
				// Enregistement des données de l'utilisateur par le noeud de son ID
				this.userService.createUser(this.user);
				let id = this.authService.currentId();
				// Redirection vers la deuxième page d'authentification
				this.navCtrl.push(InfosPage, {
					// Passage des paramètres dans la route
					user: this.user,
					id: id
				});
			},
			(error) => {
				// Affichage des erreurs
				console.log(error);

				// switch(error["code"]){
				// 	case "auth/invalid-email":
				// 		this.userService.presentToast("Adresse email incorrecte");
				// 	break;
				// 	case "auth/email-already-in-use":
				// 		this.userService.presentToast("Adresse email déjà utilisée");
				// 	break;
				// }
				console.log(error["code"]);
				console.log(this.registerForm);
			}
		);
	}
}

