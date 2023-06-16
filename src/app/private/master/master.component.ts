import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent, Event, NavigationStart } from '@angular/router';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { OutputService } from 'src/app/services/output.service';
import { menu } from 'src/app/private/menu';
import { LocalStoreService } from 'src/app/services/local-store.service';
import { filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { b2b_menu } from '../b2b_menu';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { config } from 'src/config';
import { Response } from 'src/app/models/response.model';

@Component({
   selector: 'app-master',
   templateUrl: './master.component.html',
   styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
   modulo: any;
   dataToDisplay: any;
   masterSection: any;
   r1 = Math.floor(Math.random() * (12 - 4) + 4)
   r2 = Math.floor(Math.random() * (8 - 2) + 2)
   sideMenu = menu;
   b2b_menu = b2b_menu;
   // r3= 'w-[' + Math.floor(Math.random() * (16 - 4) + 4).toString() + 'px]'
//    events =[
//       {
//           "id": "20230519205945PxaUVBpO7ffyZFCK8W",
//           "01_TITULO": "InnovAuto: Unveiling the Future of Automotive",
//           "02_DESCRIPCION":  "Join us at InnovAuto, the most anticipated event of the year in the automotive world. Over two thrilling days, interact with leading automotive brands, electric vehicle manufacturers, cutting-edge technology providers, and mobility experts. Discover the latest models of electric and autonomous vehicles, innovative solutions in connectivity, safety, and sustainability. Engage with keynote speeches by industry leaders on electric vehicle evolution, AI in autonomous driving, and emerging trends in automotive design. Participate in panel discussions, interactive sessions, and practical demonstrations to experience autonomous driving. Explore future vehicle designs and customize your own virtual car using dedicated virtual and augmented reality areas. Be part of the shift towards efficient and sustainable mobility, witnessing revolutionary advancements in the automotive industry.",
//           "00_IMG": "https://i.ytimg.com/vi/-nU7AuirndY/maxresdefault.jpg",
//       },
//       {
//           "id": "20230519210309MdG4vZcXFHHVjMdwYM",
//           "01_TITULO": "InnovAuto: Unveiling the Future of Automotive",
//           "02_DESCRIPCION": "Únete a nosotros en InnovAuto, el evento más esperado del año en el mundo de la automoción. Durante dos emocionantes días, interactúa con las principales marcas automotrices, fabricantes de vehículos eléctricos, proveedores de tecnología de vanguardia y expertos en movilidad. Descubre los últimos modelos de vehículos eléctricos y autónomos, así como soluciones innovadoras en conectividad, seguridad y sostenibilidad. Participa en conferencias magistrales ofrecidas por líderes de la industria sobre la evolución de los vehículos eléctricos, la inteligencia artificial en la conducción autónoma y las tendencias emergentes en el diseño automotriz. Únete a paneles de discusión, sesiones interactivas y demostraciones prácticas para experimentar la conducción autónoma. Explora los diseños de vehículos del futuro y personaliza tu propio automóvil virtual utilizando áreas dedicadas de realidad virtual y aumentada. Sé parte del cambio hacia una movilidad eficiente y sostenible, presenciando avances revolucionarios en la industria automotriz.",
//           "00_IMG": "https://example.com/innovauto.jpg",
//       },
//       {
//           "id": "20230519210337uTfipS00IcOZDIK7E1",
//           "01_TITULO": "FutureDrive: Shaping the Future of Mobility",
//           "02_DESCRIPCION": "Join us at FutureDrive, the premier event for exploring the future of mobility. Discover the latest advancements in electric vehicles, autonomous driving, and sustainable transportation. Engage with industry experts, participate in interactive sessions, and witness cutting-edge technologies that are shaping the future of transportation. Don't miss this opportunity to be part of the mobility revolution.",
//           "00_IMG": "https://example.com/futuredrive.jpg",
//       },
//       {
//           "id": "2023051921040048Ymq7wyZT1PnNdwUN",
//           "01_TITULO": "Autotech Expo: Discovering Automotive Technology",
//           "02_DESCRIPCION": "Experience the latest automotive technology at Autotech Expo. Get a glimpse of the cutting-edge innovations and solutions driving the automotive industry forward. Explore advancements in electric vehicles, connected cars, infotainment systems, and more. Engage with industry leaders, attend informative presentations, and witness live demonstrations. Don't miss this opportunity to immerse yourself in the future of automotive technology.",
//           "00_IMG": "https://example.com/autotech-expo.jpg",
  
//           "blog_id": null,
//           "organizer": "TechConnect Events",
//           "active": 1,
//       },
//       {
//           "id": "202305192104193qKj1r5xe8DRjd2a8B",
//           "01_TITULO": "AutoExpo: The Ultimate Auto Show",
//           "02_DESCRIPCION": "Prepárate para AutoExpo, el show de autos definitivo que presenta los vehículos más icónicos y lujosos de todo el mundo. Maravíllate con los últimos autos deportivos, automóviles clásicos y vehículos conceptuales que redefinen el diseño automotriz. Experimenta emocionantes actuaciones en vivo, exhibiciones interactivas y pruebas de manejo. Ya seas un entusiasta automotriz o simplemente aprecies la belleza de los autos, AutoExpo es un evento que no te puedes perder.",
//           "00_IMG": "https://example.com/autoexpo.jpg",
//           "cost": "20",
//           "coin": "USD",
//           "event_type": 0,
//           "blog_id": null,
//           "organizer": "Auto Shows International",
//           "active": 1,
//       },
//       {
//           "id": "20230519210446F5yIAcDr4Bf8DQPTqS",
//           "01_TITULO": "GreenDrive: Driving Towards Sustainable Transportation",
//           "02_DESCRIPCION": "Join us at GreenDrive, the event dedicated to promoting sustainable transportation solutions. Discover the latest advancements in electric vehicles, hybrid technologies, and renewable energy for transportation. Engage with industry experts, attend informative sessions, and explore eco-friendly products and services. Learn about the benefits of sustainable transportation and how it contributes to a greener future. Be part of the movement towards a more sustainable and environmentally conscious transportation system.",
//           "00_IMG": "https://example.com/greendrive.jpg",
//       },
//       {
//           "id": "20230519210633GNGJ6T8vTz13ysPg77",
//           "01_TITULO": "TechDrive Expo: Explorando la Tecnología Automotriz",
//           "02_DESCRIPCION": "Immerse yourself in the world of automotive technology at TechDrive Expo. Discover the latest advancements in AI-driven vehicles, connected car solutions, and smart mobility. Engage with industry pioneers, attend interactive workshops, and experience live demonstrations of cutting-edge technologies. From self-driving cars to innovative safety features, TechDrive Expo showcases the future of automotive innovation.",
//           "00_IMG": "https://example.com/techdrive-expo.jpg",
//       },
//       {
//           "id": "20230519210646IhZ2EvCzFPlMPFwwF2",
//           "01_TITULO": "AutoTech Summit: Shaping the Future of Automotive",
//           "02_DESCRIPCION": "Join industry leaders, innovators, and automotive enthusiasts at the AutoTech Summit. Explore the latest trends and technologies shaping the future of the automotive industry. Engage in thought-provoking discussions, attend expert-led sessions, and witness groundbreaking product launches. From electric vehicles to advanced driver-assistance systems, the AutoTech Summit is your gateway to the future of automotive excellence.",
//           "00_IMG": "https://example.com/autotech-summit.jpg",
  
//       },
//       {
//           "id": "20230519210715xgj541ORFzu2Yl4VLP",
//           "01_TITULO": "Motor Show: Celebrando la Excelencia Automotriz",
//           "02_DESCRIPCION": "Experience the thrill of Motor Show, the ultimate celebration of automotive excellence. Get up close with classic cars, exotic supercars, and powerful motorcycles. Witness breathtaking stunts, precision driving performances, and live racing demonstrations. Explore the latest aftermarket products and accessories, and engage with industry experts. Motor Show is a must-attend event for automotive enthusiasts and anyone who appreciates the beauty of machines on wheels.",
//           "00_IMG": "https://example.com/motor-show.jpg",
//       },
//       {
//           "id": "20230519210724fjkaPVFl4eCyb1V0cl",
//           "01_TITULO": "EcoDrive Conference: Driving Sustainable Mobility Solutions",
//           "02_DESCRIPCION": "Participate in the EcoDrive Conference and join the conversation on driving sustainable mobility solutions. Explore the latest innovations in electric vehicles, renewable energy, and urban transportation. Engage with industry experts, attend informative sessions, and network with like-minded individuals passionate about sustainable mobility. Together, let's pave the way towards a greener and more efficient transportation future.",
//           "00_IMG": "https://example.com/ecodrive-conference.jpg",
//       }
//   ]

   companies = [
      {
         'id': '20230519205945',
         '01_NOMBRE': 'Parque Tecnológico Sanmiguelense',
         '02_RFC': 'PTS130620I48',
         '03_PLAN': '1'
      }
   ]

  url: any;
   constructor(
      private provider: ProviderService,
      public router: Router,
      private activatedRoute: ActivatedRoute,
      private output: OutputService,
      private ls: LocalStoreService,
      private dialog: MatDialog,
      private manager: CloudinaryWidgetManager
   ) {
      router.events.pipe(
         filter((e: Event): e is RouterEvent => e instanceof RouterEvent)
      ).subscribe((e: RouterEvent) => {
         if (e instanceof NavigationEnd) {          
            this.modulo = this.activatedRoute.snapshot.paramMap.get('modulo');
            this.masterSection = this.findInMenu('link', '/m/' + this.modulo)?.label
            this.getData();
         }
      });

    }

   ngOnInit(): void {
      this.breadcrumbs();
      
   }

   getData() {
      /* // this.output.ready.next(false);
      this.dataToDisplay = []
      this.provider.BD_ActionPost(this.modulo, 'index').subscribe(
          (index: any) => {
            console.log(index);
            index.forEach((el: any) => {
               el.link_id = this.modulo;
            });
            this.dataToDisplay = index;
            console.log(this.dataToDisplay);
            
            // this.output.ready.next(true);
         }
      ) */
      this.output.ready.next(false)
      this.provider.BD_ActionAdminGet(this._modulo, 'get').subscribe(
         
         (data: Response) => {
            if(typeof data.msg == 'object') {
               this.dataToDisplay = data.msg
               this.output.ready.next(true)
            } /* else {
               this.dataToDisplay = [{name: 'No hay registros disponibles'}]
            } */
         }
         
      )

   }

   get _modulo() {
      let m = ''
      this.activatedRoute.params.subscribe(params => {
         console.log(params);
         
         m = params['modulo']; 
       });
       
       return m
   }

   findInMenu(propiedad: any, valor: any) { 
      let turnBack: any

      this.b2b_menu.filter(
         (item: any) => { 
            if(item.link == valor)
               turnBack = item
         }
      )

      
      /* this.b2b_menu.forEach((element: any) => {
         element.filter((el: any, index: any) => {
            if (el[propiedad] === valor)
               turnBack = el.item;
         })
      }); */
      return turnBack
   }

   breadcrumbs() {
      this.ls.update('bc', [
         {
            item: this.masterSection,
            link: null/* '/m/' + this.modulo */
         }
      ])
   }


   edit(row?: any): void {
      console.log(row.ID, btoa(row.ID));
      
      this.router.navigate([this.router.url, 'detail', btoa(row.ID)])
   }

   add(): void {
      this.router.navigate([this.router.url, 'add'])
   }

   viewCompany(){
      this.router.navigate([this.router.url, 'detail'])
   }
}
