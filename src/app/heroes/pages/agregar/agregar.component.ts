import { ConfirmarComponent } from './../../components/confirmar/confirmar.component';
import { switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroesService } from './../../services/heroes.service';
import { Component, OnInit } from '@angular/core';
import { Heroe, Publisher } from '../../interfaces/heroes.interface.';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [],
})
export class AgregarComponent implements OnInit {
  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics',
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics',
    },
  ];

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: '',
  };

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('editar')) {
      return;
    }
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroePorId(id)))
      .subscribe((heroe) => {
        this.heroe = heroe;
      });
  }

  guardar() {
    if (this.heroe.superhero.trim().length === 0) {
      return;
    }

    if (this.heroe.id) {
      //actualiza
      this.heroesService.actualizarHeroe(this.heroe).subscribe((heroe) => {
        this.mostrarSnakbar("Registro Actualizado");
      });
    } else {
      //crea nuevo
      this.heroesService.agregarHeroe(this.heroe).subscribe((heroe) => {
        this.router.navigate(['/heroes/editar', heroe.id]);
        this.mostrarSnakbar("Registro Creado");
      });
    }
  }

  borrarHeroe() {
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: this.heroe
      // height:'300px'
    });

    dialog.afterClosed().subscribe(
      (result) => {
        if(result){
          this.heroesService.borrarrHeroe(this.heroe.id!).subscribe((result) => {
            this.router.navigate(['/heroes']);
            this.mostrarSnakbar("Registro Eliminado");
          });
        }
      }
    );
  }

  mostrarSnakbar(mensaje:string){
    this.snackBar.open(mensaje, 'cerrar',{
      duration: 2500
    });
  }
}
